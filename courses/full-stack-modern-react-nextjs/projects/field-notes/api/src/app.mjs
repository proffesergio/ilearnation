import express from 'express';
import { randomUUID } from 'node:crypto';
import { buildSchema, execute, parse, validate, visit } from 'graphql';
import { ApiError, createMemoryStore, noteInput } from './store.mjs';
import { createIdentity, credentials, passwordHash, passwordMatches } from './auth.mjs';

export { createMemoryStore, createMongoStore } from './store.mjs';
const schema = buildSchema(`
  type Note { id: ID!, title: String!, body: String!, slug: String!, authorId: ID!, createdAt: String! }
  type Query { notes: [Note!]!, note(id: ID!): Note }
  type Mutation { createNote(title: String!, body: String!): Note! }
`);

function pageOptions(query) {
  const { search = '', sort = 'newest', limit = '100' } = query;
  if (typeof search !== 'string' || search.length > 100 || !['oldest', 'newest'].includes(sort) || typeof limit !== 'string' || !/^\d{1,3}$/.test(limit) || Number(limit) < 1 || Number(limit) > 100)
    throw new ApiError(400, 'Use search up to 100 characters, oldest/newest sort and a limit of 1–100.');
  return { search, sort, limit: Number(limit) };
}

/** Public technical notes only; API authentication is separate from iLearnNation. */
export function createApp({ store = createMemoryStore(), secret } = {}) {
  const app = express();
  const identity = createIdentity(secret, store);
  app.disable('x-powered-by');
  app.locals.store = store;
  app.locals.identity = identity;
  app.use((_request, response, next) => {
    response.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    next();
  });
  app.use(express.json({ limit: '16kb', strict: true }));
  // In-process teaching limit. Production needs a shared limiter and proxy policy.
  const windows = new Map();
  app.use((request, _response, next) => {
    const now = Date.now();
    for (const [key, value] of windows) if (value.reset < now) windows.delete(key);
    const key = `${request.ip}:${request.path.startsWith('/api/auth/') ? 'auth' : 'api'}`;
    const current = windows.get(key) || { count: 0, reset: now + 60_000 };
    current.count += 1;
    if (!windows.has(key) && windows.size >= 5000) return next(new ApiError(429, 'Server busy; retry later.'));
    windows.set(key, current);
    const limit = request.path.startsWith('/api/auth/') ? 20 : 200;
    next(current.count > limit ? new ApiError(429, 'Too many requests; retry later.') : undefined);
  });
  async function actor(request) {
    const header = request.headers.authorization;
    if (typeof header !== 'string' || !header.startsWith('Bearer ')) throw new ApiError(401, 'Sign in to continue.');
    return identity.verify(header.slice(7));
  }
  app.get('/health', (_request, response) => response.json({ ok: true }));
  app.get('/api/notes', async (request, response) => response.json({ notes: await store.listNotes(pageOptions(request.query)) }));
  app.get('/api/notes/:id', async (request, response) => {
    if (request.params.id.length > 200) throw new ApiError(400, 'Invalid note ID.');
    const note = await store.getNote(request.params.id);
    if (!note) throw new ApiError(404, 'Note not found.');
    response.json({ note });
  });
  app.post('/api/auth/signup', async (request, response) => {
    const input = credentials(request.body);
    const stored = await store.createUser({ id: randomUUID(), email: input.email, passwordHash: await passwordHash(input.password) });
    const user = { id: stored.id, email: stored.email };
    response.status(201).json({ token: await identity.token(user), user });
  });
  app.post('/api/auth/login', async (request, response) => {
    const input = credentials(request.body);
    const stored = await store.findUser(input.email);
    if (!stored || !(await passwordMatches(input.password, stored.passwordHash))) throw new ApiError(401, 'Email or password did not match.');
    const user = { id: stored.id, email: stored.email };
    response.json({ token: await identity.token(user), user });
  });
  app.post('/api/notes', async (request, response) => {
    const authorId = await actor(request);
    const event = await store.createNote({ authorId, ...noteInput(request.body) });
    response.status(201).json({ note: event.note });
  });
  app.put('/api/notes/:id', async (request, response) => {
    const authorId = await actor(request);
    response.json({ note: await store.updateNote(request.params.id, authorId, noteInput(request.body)) });
  });
  app.delete('/api/notes/:id', async (request, response) => {
    await store.deleteNote(request.params.id, await actor(request));
    response.status(204).end();
  });
  app.get('/api/stats', async (_request, response) => response.json(await store.stats()));
  app.post('/graphql', async (request, response) => {
    const { query, variables, operationName } = request.body || {};
    if (typeof query !== 'string' || query.length > 6000 || (variables !== undefined && (!variables || typeof variables !== 'object' || Array.isArray(variables))) || (operationName !== undefined && typeof operationName !== 'string'))
      throw new ApiError(400, 'Provide a bounded GraphQL query and variables object.');
    let document;
    try { document = parse(query, { maxTokens: 1000 }); } catch { throw new ApiError(400, 'Invalid GraphQL syntax.'); }
    let fields = 0;
    let depth = 0;
    let tooDeep = false;
    visit(document, {
      Field: { enter() { fields += 1; depth += 1; if (depth > 6) tooDeep = true; }, leave() { depth -= 1; } },
      FragmentSpread() { throw new ApiError(400, 'Fragments are outside this bounded teaching API.'); },
    });
    if (tooDeep || fields > 60 || document.definitions.length !== 1) throw new ApiError(400, 'Use one operation with at most 60 fields and depth 6.');
    const errors = validate(schema, document);
    if (errors.length) return response.status(400).json({ errors: errors.map((error) => ({ message: error.message })) });
    const result = await execute({ schema, document, variableValues: variables, operationName, rootValue: {
      notes: () => store.listNotes(),
      note: ({ id }) => store.getNote(id),
      createNote: async ({ title, body }) => (await store.createNote({ authorId: await actor(request), ...noteInput({ title, body }) })).note,
    } });
    response.json({ ...result, ...(result.errors ? { errors: result.errors.map((error) => ({ message: error.originalError instanceof ApiError ? error.originalError.message : 'Operation failed.' })) } : {}) });
  });
  app.use((_request, _response, next) => next(new ApiError(404, 'Route not found.')));
  app.use((error, _request, response, _next) => {
    const status = error instanceof ApiError ? error.status : error.type === 'entity.too.large' ? 413 : error.type === 'entity.parse.failed' ? 400 : 503;
    response.status(status).json({ error: error instanceof ApiError ? error.message : status === 400 ? 'Invalid JSON.' : status === 413 ? 'Request too large.' : 'Storage is unavailable. Retry later.' });
  });
  return app;
}
