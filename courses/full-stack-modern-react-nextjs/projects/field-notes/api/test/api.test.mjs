import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import { SignJWT } from 'jose';
import { createApp, createMemoryStore } from '../src/app.mjs';

const secret = 'synthetic-test-secret-that-is-never-a-live-credential';
const signup = (app, email = 'learner@example.test') => request(app).post('/api/auth/signup').send({ email, password: 'synthetic-password-2026' });

describe('Field Notes REST boundary', () => {
  test('health, public list, signup, login and normalized creation form a real HTTP loop', async () => {
    const app = createApp({ secret });
    expect((await request(app).get('/health')).body).toEqual({ ok: true });
    expect((await request(app).get('/api/notes')).body).toEqual({ notes: [] });
    const account = await signup(app);
    expect(account.status).toBe(201);
    expect(account.body.user.email).toBe('learner@example.test');
    expect(JSON.stringify(account.body)).not.toContain('passwordHash');
    const login = await request(app).post('/api/auth/login').send({ email: 'LEARNER@example.test', password: 'synthetic-password-2026' });
    expect(login.status).toBe(200);
    const saved = await request(app).post('/api/notes').auth(login.body.token, { type: 'bearer' }).send({ title: '  Learn HTTP  ', body: 'Trace one request.' });
    expect(saved.status).toBe(201);
    expect(saved.body.note.title).toBe('Learn HTTP');
    expect(saved.body.note.authorId).toBe(account.body.user.id);
    expect((await request(app).get(`/api/notes/${saved.body.note.slug}`)).body.note.id).toBe(saved.body.note.id);
    expect((await request(app).get('/api/notes?search=HTTP&sort=oldest&limit=1')).body.notes).toHaveLength(1);
    expect((await request(app).get('/api/stats')).body.totalNotes).toBe(1);
  });
  test('invalid and unauthenticated writes never create a note; forged ownership is rejected', async () => {
    const app = createApp({ secret });
    const { body: account } = await signup(app);
    expect((await request(app).post('/api/notes').send({ title: 'Denied' })).status).toBe(401);
    for (const input of [{ title: '' }, { title: 'x'.repeat(121) }, { title: 'Valid', body: 'x'.repeat(5001) }, { title: 'Forged', authorId: 'another' }]) {
      expect((await request(app).post('/api/notes').auth(account.token, { type: 'bearer' }).send(input)).status).toBe(400);
    }
    expect((await request(app).get('/api/notes')).body.notes).toEqual([]);
    expect((await request(app).get('/api/notes?limit=10000')).status).toBe(400);
    expect((await request(app).post('/api/notes').set('Content-Type', 'application/json').send('{bad')).status).toBe(400);
  });
  test('another user cannot update or delete a note, while its owner can', async () => {
    const app = createApp({ secret });
    const { body: one } = await signup(app, 'one@example.test');
    const { body: two } = await signup(app, 'two@example.test');
    const saved = await request(app).post('/api/notes').auth(one.token, { type: 'bearer' }).send({ title: 'Original' });
    const path = `/api/notes/${saved.body.note.id}`;
    expect((await request(app).put(path).auth(two.token, { type: 'bearer' }).send({ title: 'Stolen' })).status).toBe(403);
    expect((await request(app).delete(path).auth(two.token, { type: 'bearer' })).status).toBe(403);
    expect((await request(app).put(path).auth(one.token, { type: 'bearer' }).send({ title: 'Revised' })).body.note.title).toBe('Revised');
    expect((await request(app).delete(path).auth(one.token, { type: 'bearer' })).status).toBe(204);
    expect((await request(app).get(path)).status).toBe(404);
  });
  test('JWT expiry, issuer and audience are checked rather than merely decoded', async () => {
    const app = createApp({ secret });
    const { body: account } = await signup(app);
    for (const claims of [{ exp: 1 }, { iss: 'other-api' }, { aud: 'other-client' }]) {
      const token = await new SignJWT({ sub: account.user.id, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 900, iss: 'field-notes-api', aud: 'field-notes-client', ...claims }).setProtectedHeader({ alg: 'HS256' }).sign(new TextEncoder().encode(secret));
      expect((await request(app).post('/api/notes').auth(token, { type: 'bearer' }).send({ title: 'Denied' })).status).toBe(401);
    }
    expect(() => createApp({ secret: 'short' })).toThrow(/JWT_SECRET/);
  });
  test('storage failures are unavailable responses with no driver details', async () => {
    const store = createMemoryStore();
    store.listNotes = async () => { throw new Error('private-connection-value'); };
    const response = await request(createApp({ secret, store })).get('/api/notes');
    expect(response.status).toBe(503);
    expect(JSON.stringify(response.body)).not.toContain('private-connection-value');
  });
});

describe('GraphQL contract', () => {
  test('typed queries and authenticated mutations share the REST repository', async () => {
    const app = createApp({ secret });
    const account = await signup(app);
    const mutation = 'mutation Add($title:String!,$body:String!){createNote(title:$title,body:$body){id title}}';
    const denied = await request(app).post('/graphql').send({ query: mutation, variables: { title: 'Graph note', body: 'One repository.' } });
    expect(denied.body.errors).toHaveLength(1);
    const created = await request(app).post('/graphql').auth(account.body.token, { type: 'bearer' }).send({ query: mutation, variables: { title: 'Graph note', body: 'One repository.' } });
    expect(created.body.data.createNote.title).toBe('Graph note');
    const list = await request(app).post('/graphql').send({ query: '{notes{id title}}' });
    expect(list.body.data.notes).toHaveLength(1);
    expect((await request(app).get('/api/notes')).body.notes).toHaveLength(1);
    expect((await request(app).post('/graphql').send({ query: '{notes{passwordHash}}' })).status).toBe(400);
    expect((await request(app).post('/graphql').send({ query: '{notes{...N}} fragment N on Note{id}' })).status).toBe(400);
  });
});

describe('durable-event adapter contract', () => {
  test('retries deduplicate per author/client ID and reject changed content', async () => {
    const store = createMemoryStore({ now: () => '2026-10-16T12:00:00.000Z' });
    const input = { authorId: 'owner-a', clientId: 'retry-one', title: 'One operation', body: '' };
    const [one, retry] = await Promise.all([store.createNote(input), store.createNote(input)]);
    expect(retry.eventId).toBe(one.eventId);
    await expect(store.createNote({ ...input, title: 'Changed' })).rejects.toMatchObject({ status: 409 });
    const other = await store.createNote({ ...input, authorId: 'owner-b' });
    expect(other.eventId).not.toBe(one.eventId);
    expect((await store.history('owner-a', 0)).events).toHaveLength(1);
    expect((await store.history('owner-a', one.sequence)).events).toEqual([]);
    expect(await store.stats()).toEqual({ totalNotes: 2, byDay: [{ day: '2026-10-16', count: 2 }] });
  });
  test('history paging keeps advancing through more than one hundred events', async () => {
    const store = createMemoryStore();
    for (let index = 0; index < 103; index++) await store.createNote({ authorId: 'owner', clientId: `event-${index}`, title: `Note ${index}` });
    const first = await store.history('owner', 0);
    const second = await store.history('owner', first.nextCursor);
    expect(first.events).toHaveLength(100);
    expect(first.hasMore).toBe(true);
    expect(second.events).toHaveLength(3);
    expect(second.hasMore).toBe(false);
    expect(new Set([...first.events, ...second.events].map((event) => event.eventId)).size).toBe(103);
  });
});
