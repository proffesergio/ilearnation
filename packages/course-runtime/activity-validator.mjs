// SERVER ONLY: keep this module out of client component import graphs.
import { isDeepStrictEqual as equal } from 'node:util';
import { getActivity } from './activities.mjs';
import { checkExercise } from './index.mjs';

const deniedKeys = new Set(['__proto__', 'prototype', 'constructor']);
const failure = (message) => ({
  passed: false,
  message,
  checks: [{ name: 'Input', passed: false, detail: message }],
});

function parseConfig(source, starter) {
  if (typeof source !== 'string' || source.length > 8192)
    throw new Error('Use JSON text under 8 KB.');
  const config = JSON.parse(source);
  if (!config || typeof config !== 'object' || Array.isArray(config))
    throw new Error('Use one JSON object.');
  const queue = [[config, 0]];
  let nodes = 0;
  while (queue.length) {
    const [value, depth] = queue.pop();
    if (++nodes > 200 || depth > 6)
      throw new Error('Keep the lab configuration small and shallow.');
    if (typeof value === 'number' && (!Number.isSafeInteger(value) || Math.abs(value) > 100000))
      throw new Error('Use whole numbers between -100000 and 100000.');
    if (typeof value === 'string' && value.length > 300)
      throw new Error('Keep each configuration string under 301 characters.');
    if (value && typeof value === 'object') {
      if (Object.keys(value).some((key) => deniedKeys.has(key)))
        throw new Error('Reserved object keys are not allowed.');
      for (const child of Object.values(value)) queue.push([child, depth + 1]);
    }
  }
  const shape = JSON.parse(starter);
  if (!equal(Object.keys(config).sort(), Object.keys(shape).sort()))
    throw new Error('Keep exactly the fields shown in the starter.');
  for (const key of Object.keys(shape)) {
    if (Array.isArray(shape[key])) {
      if (
        !Array.isArray(config[key]) ||
        config[key].length > 12 ||
        config[key].some((v) => typeof v !== 'string')
      )
        throw new Error(`${key} must be a short array of strings.`);
    } else if (typeof shape[key] !== typeof config[key] || config[key] === null)
      throw new Error(`${key} has the wrong value type.`);
  }
  return config;
}

// Each configuration drives a fixed synthetic scenario. No user text becomes code,
// a URL request, a database query, an import, or a filesystem path.
function simulate(id, c, check) {
  switch (id) {
    case 'javascript-typescript': {
      const input = [
        { title: ' React ', minutes: 20 },
        { title: 'Tiny', minutes: 5 },
        { title: ' Types ', minutes: 15 },
        { title: 12, minutes: 30 },
      ];
      const original = structuredClone(input);
      const valid = input.filter(
        (item) => typeof item.title === 'string' && Number.isFinite(item.minutes),
      );
      const result = (
        c.operation === 'filter-map'
          ? valid.filter((item) => item.minutes >= c.minimumMinutes)
          : valid
      ).map((item) => (c.trimTitles ? item.title.trim() : item.title));
      check(
        'Queue output',
        equal(result, ['React', 'Types']),
        `Result: ${JSON.stringify(result)}; keep the two sessions of at least 15 minutes.`,
      );
      check(
        'Boundary and source',
        c.minimumMinutes === 15 && equal(input, original),
        'The 15-minute boundary is included and source records remain unchanged.',
      );
      break;
    }
    case 'react-components': {
      const transition = (state, action) => {
        const next = c.update === 'immutable' ? { ...state } : state;
        next.count =
          action === 'reset'
            ? c.minimum
            : Math.max(
                c.minimum,
                Math.min(c.maximum, state.count + (action === 'increment' ? c.step : -c.step)),
              );
        return next;
      };
      const source = { count: 2 };
      const next = transition(source, 'increment');
      check(
        'Increment without mutation',
        next.count === 3 && source.count === 2 && next !== source,
        `Input ${source.count}; output ${next.count}; return a new object.`,
      );
      check(
        'Bounds and reset',
        transition({ count: 0 }, 'decrement').count === 0 &&
          transition({ count: 5 }, 'increment').count === 5 &&
          transition({ count: 4 }, 'reset').count === 0,
        'Decrement at 0, increment at 5, and reset must remain within the specified bounds.',
      );
      break;
    }
    case 'node-and-data': {
      const documents = [
        { id: 'a', ownerId: 'u', title: 'First', created: 1, secret: 'private' },
        { id: 'b', ownerId: 'v', title: 'Other', created: 4, secret: 'private' },
        { id: 'c', ownerId: 'u', title: 'Third', created: 3, secret: 'private' },
        { id: 'd', ownerId: 'u', title: 'Second', created: 2, secret: 'private' },
      ];
      const results = documents
        .filter((doc) => doc[c.ownerField] === 'u')
        .sort((a, b) => (c.sort === 'newest' ? b.created - a.created : a.created - b.created))
        .slice(0, Math.max(0, Math.min(c.limit, 10)))
        .map((doc) =>
          Object.fromEntries(
            c.projection.filter((key) => Object.hasOwn(doc, key)).map((key) => [key, doc[key]]),
          ),
        );
      check(
        'Scoped latest page',
        equal(
          results.map((r) => r.id),
          ['c', 'd'],
        ),
        `Returned IDs: ${JSON.stringify(results.map((r) => r.id))}. Expected only this owner's two latest documents.`,
      );
      check(
        'Projection privacy',
        equal(results, [
          { id: 'c', title: 'Third' },
          { id: 'd', title: 'Second' },
        ]),
        'Return id and title only, never the private storage field.',
      );
      break;
    }
    case 'api-contracts': {
      const writes = [];
      const request = (method, title) => {
        if (method !== c.method) return 405;
        const normalized = c.trim ? title.trim() : title;
        if (!normalized || title.length > c.maxTitleLength) return c.invalidStatus;
        writes.push(normalized);
        return c.createdStatus;
      };
      check(
        'Creation contract',
        request('POST', ' Learn ') === 201 && writes[0] === 'Learn',
        'POST should create one normalized title and report 201.',
      );
      const before = writes.length;
      check(
        'Reject without writing',
        request('POST', ' ') === 400 &&
          request('POST', 'x'.repeat(121)) === 400 &&
          writes.length === before,
        'Blank and oversized titles must return 400 without a write.',
      );
      check(
        'Method boundary',
        request('GET', 'Read') === 405 && c.maxTitleLength === 120,
        'GET cannot create notes; use the declared 120-character boundary.',
      );
      break;
    }
    case 'async-data': {
      const key = (owner) =>
        c.queryKey.map((part) => (part === 'ownerId' ? owner : part)).join(':');
      let rows = ['new'];
      if (c.staleResponse !== 'ignore') rows = ['old'];
      check(
        'Late response',
        equal(rows, ['new']),
        'Request 2 resolves first; request 1 must not overwrite it.',
      );
      if (c.failure !== 'preserve') rows = [];
      check(
        'Refresh failure',
        equal(rows, ['new']) && c.retries === 1,
        'Retain the last successful rows, show the error, and retry at most once.',
      );
      check(
        'Cache identity',
        key('a') !== key('b') && equal(c.queryKey, ['notes', 'ownerId']),
        'Different owners must not share the same query cache entry.',
      );
      break;
    }
    case 'data-and-forms': {
      const save = (title, fail = false) => {
        const normalized = c.trim ? title.trim() : title;
        if (!normalized || title.length > c.maxTitleLength)
          return { error: true, writes: 0, draft: title };
        if (fail) return { error: true, writes: 0, draft: c.onFailure === 'preserve' ? title : '' };
        return {
          owner: c.ownerSource === 'session' ? 'u' : 'forged',
          title: normalized,
          writes: 1,
        };
      };
      check(
        'Trusted ownership',
        equal(save(' Learn '), { owner: 'u', title: 'Learn', writes: 1 }),
        'The stored owner comes from the verified session; normalize the title.',
      );
      check(
        'Reject invalid input',
        save(' ').error && save('x'.repeat(121)).error && c.maxTitleLength === 120,
        'Reject empty and oversized values before saving.',
      );
      check(
        'Recover failed save',
        save('Draft', true).draft === 'Draft' && save('Draft', true).writes === 0,
        'A repository failure preserves the draft and reports no committed write.',
      );
      break;
    }
    case 'identity-and-access': {
      const read = (session, bodyActor, owner) => {
        const actor = c.identitySource === 'session' ? session?.id : bodyActor;
        if (!actor || (c.rejectExpired && session?.expired)) return false;
        return !c.requireOwner || owner === actor;
      };
      check(
        'Valid session',
        read({ id: 'a' }, 'forged', 'a'),
        'A valid owner session may read its own note.',
      );
      check(
        'Untrusted and cross-owner',
        !read(null, 'a', 'a') && !read({ id: 'b' }, 'a', 'a'),
        'Body identity and an authenticated different owner must not grant access.',
      );
      check(
        'Expiry and cookie',
        !read({ id: 'a', expired: true }, 'a', 'a') && c.cookieMode === 'httpOnly',
        'Expired sessions fail, and session cookies cannot be read by page JavaScript.',
      );
      break;
    }
    case 'rendering-and-seo': {
      const initial = c.publicRendering === 'server' ? `<h1>${c.title}</h1>` : '<div></div>';
      const canonical = `${c.canonicalOrigin}/courses`;
      check(
        'Useful initial document',
        initial === '<h1>Learning notebook</h1>',
        'Public initial HTML must contain the meaningful heading, before client scripts run.',
      );
      check(
        'Private discoverability',
        c.privateRobots === 'noindex',
        'Private pages need noindex metadata as well as authorization.',
      );
      check(
        'Canonical host',
        canonical === 'https://learn.example/courses',
        'A forged request Host must not control the canonical URL.',
      );
      break;
    }
    case 'quality-accessibility-security': {
      const run = (saved, rejectedWritten) =>
        (!c.assertSaved || saved) && (!c.assertRejected || !rejectedWritten);
      check(
        'Regression detection',
        run(true, false) && !run(false, false) && !run(true, true),
        'The test must fail both when saving breaks and when invalid input is written.',
      );
      check(
        'Accessible locator',
        c.locator === 'role' && c.inputLabel === 'Note title',
        'Locate the textbox by its role and visible name: Note title.',
      );
      const allowed = (url) => c.urlSchemes.includes(new URL(url).protocol);
      check(
        'Link policy',
        allowed('https://learn.example') &&
          !allowed('javascript:alert(1)') &&
          !allowed('data:text/plain,x') &&
          equal(c.urlSchemes, ['https:']),
        'Allow the required HTTPS reference while rejecting active and embedded data schemes.',
      );
      break;
    }
    case 'learning-insights': {
      const events = [
        { id: '1', learner: 'a', consent: true, day: 'Mon' },
        { id: '1', learner: 'a', consent: true, day: 'Mon' },
        { id: '2', learner: 'b', consent: true, day: 'Mon' },
        { id: '3', learner: 'c', consent: true, day: 'Mon' },
        { id: '4', learner: 'd', consent: false, day: 'Mon' },
        { id: '5', learner: 'a', consent: true, day: 'Tue' },
      ];
      const seen = new Set();
      const groups = new Map();
      for (const e of events) {
        if (c.consentOnly && !e.consent) continue;
        if (c.deduplicate && seen.has(e.id)) continue;
        seen.add(e.id);
        const key = c.groupBy === 'day' ? e.day : e.learner;
        const group = groups.get(key) ?? { count: 0, learners: new Set() };
        group.count++;
        group.learners.add(e.learner);
        groups.set(key, group);
      }
      const published = [...groups]
        .filter(([, g]) => g.learners.size >= c.minimumGroup)
        .map(([day, g]) => ({ day, count: g.count }));
      check(
        'Consented aggregate',
        equal(published, [{ day: 'Mon', count: 3 }]),
        `Published: ${JSON.stringify(published)}. Only Monday has three consented distinct learners.`,
      );
      check(
        'Threshold boundary',
        c.minimumGroup === 3 && c.consentOnly && c.deduplicate,
        'Use the specified threshold; repeated delivery and withdrawn consent cannot inflate the chart.',
      );
      break;
    }
    case 'graphql-api': {
      const resolve = (fields, depth, actor) => {
        if (depth > c.maxDepth) return { error: 'depth' };
        if (fields.some((f) => !c.fields.includes(f)) && c.unknownField === 'reject')
          return { error: 'field' };
        const owner = c.ownerSource === 'session' ? actor : 'forged';
        if (owner !== 'u') return { error: 'owner' };
        const doc = { id: '1', title: 'Learn', secret: 'hidden' };
        return Object.fromEntries(
          fields.filter((f) => c.fields.includes(f)).map((f) => [f, doc[f]]),
        );
      };
      check(
        'Selected public fields',
        equal(resolve(['id', 'title'], 2, 'u'), { id: '1', title: 'Learn' }),
        'Resolve only requested public fields for the current owner.',
      );
      check(
        'Schema and depth',
        resolve(['secret'], 1, 'u').error === 'field' &&
          resolve(['id'], 3, 'u').error === 'depth' &&
          c.maxDepth === 2,
        'Reject a private field and a query beyond the lab depth limit.',
      );
      check(
        'Resolver authorization',
        resolve(['id'], 1, 'other').error === 'owner' && equal(c.fields, ['id', 'title']),
        'Arguments cannot replace the authenticated actor in a resolver.',
      );
      break;
    }
    case 'graphql-client': {
      const identity = (note) => c.keyFields.map((field) => note[field]).join(':');
      let cache = [{ __typename: 'Note', id: '1', title: 'Old' }];
      const confirmation = { __typename: 'Note', id: '1', title: 'Updated' };
      for (let i = 0; i < 2; i++) {
        const at = cache.findIndex((n) => identity(n) === identity(confirmation));
        if (c.mutationPolicy === 'upsert' && at >= 0) cache[at] = confirmation;
        else cache.push(confirmation);
      }
      check(
        'Confirmation reconciliation',
        cache.length === 1 &&
          cache[0].title === 'Updated' &&
          equal(c.keyFields, ['__typename', 'id']),
        'Two confirmations update one normalized note without duplicating it.',
      );
      cache.push({ __typename: 'Note', id: 'temporary', title: 'Pending' });
      if (c.rollbackOnError) cache = cache.filter((n) => n.id !== 'temporary');
      check(
        'Failed optimistic mutation',
        cache.length === 1 && c.errorPolicy === 'show',
        'Remove the failed optimistic entry and surface an actionable error while retaining the confirmed note.',
      );
      break;
    }
    case 'realtime-server': {
      const send = (session, member, text, fail = false) => {
        const actor = c.actorSource === 'session' ? session : 'forged';
        if (
          !actor ||
          (c.roomPolicy === 'member' && !member) ||
          !text.trim() ||
          text.length > c.maxMessageLength
        )
          return { accepted: false, ack: false };
        return { accepted: !fail, ack: c.acknowledge === 'before-persist' || !fail, actor };
      };
      check(
        'Persist then acknowledge',
        equal(send('u', true, 'Hello'), { accepted: true, ack: true, actor: 'u' }) &&
          !send('u', true, 'Hello', true).ack,
        'A successful event is attributed to the session; failed storage never receives a success acknowledgement.',
      );
      check(
        'Room and payload boundary',
        !send(null, true, 'Hi').accepted &&
          !send('u', false, 'Hi').accepted &&
          !send('u', true, 'x'.repeat(281)).accepted &&
          c.maxMessageLength === 280,
        'Missing identity, non-members, and oversized messages must be rejected.',
      );
      break;
    }
    case 'realtime-client': {
      const pending = [];
      for (let i = 1; i <= 5; i++)
        if (c.offline === 'queue' && pending.length < c.maxQueue) pending.push(`m${i}`);
      check(
        'Bounded offline queue',
        equal(pending, ['m1', 'm2', 'm3']),
        `Queued: ${JSON.stringify(pending)}. The last two sends must report a full queue rather than silently disappearing.`,
      );
      const retryIds = pending.map((id) => (c.retry === 'same-id' ? id : `${id}-retry`));
      const incoming = [...pending, ...retryIds];
      const visible = c.deduplicate ? [...new Set(incoming)] : incoming;
      check(
        'Stable replay identity',
        equal(visible, ['m1', 'm2', 'm3']) && equal(retryIds, pending),
        'Reconnect retries preserve IDs; duplicate confirmations create no duplicate messages.',
      );
      break;
    }
    case 'realtime-persistence': {
      const entries = [
        { ownerId: 'a', clientId: 'm', sequence: 1, age: 2 },
        { ownerId: 'a', clientId: 'm', sequence: 1, age: 2 },
        { ownerId: 'b', clientId: 'm', sequence: 2, age: 2 },
        { ownerId: 'a', clientId: 'n', sequence: 3, age: 2 },
        { ownerId: 'a', clientId: 'o', sequence: 4, age: 31 },
        { ownerId: 'a', clientId: 'p', sequence: 5, age: 1 },
      ];
      const keys = new Set();
      const committed = entries.filter((e) => {
        const key = c.uniqueBy.map((f) => e[f]).join(':');
        if (keys.has(key)) return false;
        keys.add(key);
        return true;
      });
      const replay = committed
        .filter(
          (e) => e.ownerId === 'a' && e.sequence > c.afterSequence && e.age <= c.retentionDays,
        )
        .sort((a, b) =>
          c.order === 'ascending' ? a.sequence - b.sequence : b.sequence - a.sequence,
        );
      check(
        'Scoped idempotency',
        committed.length === 5 && equal(c.uniqueBy, ['ownerId', 'clientId']),
        'A repeated client event writes once; another owner may use the same client ID.',
      );
      check(
        'Cursor and retention',
        equal(
          replay.map((e) => e.sequence),
          [3, 5],
        ) &&
          c.afterSequence === 2 &&
          c.retentionDays === 30,
        `Replay sequences: ${JSON.stringify(replay.map((e) => e.sequence))}; omit old, expired, and other-owner events.`,
      );
      break;
    }
    case 'nextjs-routing': {
      const stored = { id: 'n', title: 'Learn', databaseUrl: 'private' };
      const props = Object.fromEntries(
        c.publicProps.filter((f) => Object.hasOwn(stored, f)).map((f) => [f, stored[f]]),
      );
      check(
        'Execution boundary',
        c.dataComponent === 'server' && c.interactiveComponent === 'client',
        'Database access remains server-side; stateful click handling belongs to the client component.',
      );
      check(
        'Serialized props',
        equal(props, { id: 'n', title: 'Learn' }),
        'Only the id and title may cross the serialized props boundary.',
      );
      check(
        'Missing route',
        c.missingRoute === 'not-found',
        'An absent note needs an explicit not-found response rather than an empty success page.',
      );
      break;
    }
    case 'caching-performance': {
      const key = (owner, note) =>
        c.cacheKey.map((f) => (f === 'ownerId' ? owner : note)).join(':');
      const cache = new Map([[key('a', '1'), 'old']]);
      check(
        'Owner isolation',
        key('a', '1') !== key('b', '1') && equal(c.cacheKey, ['ownerId', 'noteId']),
        'Two owners reading note ID 1 must not collide in a private cache.',
      );
      if (c.invalidateOnWrite) cache.delete(key('a', '1'));
      const readAfterWrite = cache.get(key('a', '1')) ?? 'updated';
      check(
        'Fresh read after write',
        readAfterWrite === 'updated' && c.privatePolicy === 'no-store',
        'Invalidate after a confirmed write and prevent private HTTP responses entering a shared cache.',
      );
      check(
        'Asset budget',
        c.assetBudgetKb === 150 && 180 > c.assetBudgetKb && 80 <= c.assetBudgetKb,
        'The 150 KB optional asset budget rejects 180 KB and accepts 80 KB.',
      );
      break;
    }
    case 'production-workflows': {
      const required = ['lint', 'typecheck', 'test', 'build'];
      const release = (results, approved) =>
        c.checks.every((name) => results[name] === true) && (c.approval !== 'required' || approved);
      const green = Object.fromEntries(required.map((name) => [name, true]));
      check(
        'Quality gates',
        release(green, true) &&
          required.every((name) => !release({ ...green, [name]: false }, true)) &&
          equal([...c.checks].sort(), [...required].sort()),
        'Each failed required check must block release.',
      );
      check(
        'Approval and secrets',
        !release(green, false) && c.secretScope === 'server',
        'A green build without approval remains blocked; secrets stay outside public bundles.',
      );
      check(
        'Recovery artifact',
        c.rollback === 'previous-artifact',
        'A failed health check restores the previously tested artifact rather than rebuilding changing source.',
      );
      break;
    }
    case 'capstone': {
      const notes = [];
      const save = (title, fail = false) => {
        if (c.validation === 'server' && (!title.trim() || title.length > 120))
          return { ok: false };
        if (fail) return { ok: c.saveOrder !== 'commit-then-confirm' };
        const note = {
          id: 'n',
          owner: c.ownerSource === 'session' ? 'a' : 'forged',
          title: title.trim(),
        };
        notes.push(note);
        return { ok: true, note };
      };
      check(
        'Owner create',
        save(' Learn ').note?.owner === 'a' && notes[0]?.title === 'Learn',
        'Create a normalized note belonging to the trusted session.',
      );
      check(
        'Failure safety',
        !save(' ').ok && !save('x'.repeat(121)).ok && !save('Draft', true).ok,
        'Invalid input and failed storage must not report successful work.',
      );
      const visible = notes.filter((n) => n.owner === 'b');
      const deletable = notes.filter((n) => c.deleteScope === 'all' || n.owner === 'b');
      const exported =
        c.exportFormat === 'json'
          ? JSON.stringify(notes.filter((n) => n.owner === 'a'))
          : '<html></html>';
      check(
        'Private lifecycle',
        visible.length === 0 &&
          deletable.length === 0 &&
          exported.startsWith('[{') &&
          notes.length === 1,
        'Another owner can neither read nor delete the note; the owner receives one machine-readable export record.',
      );
      break;
    }
    default:
      throw new Error('Unknown activity.');
  }
}

export function checkActivity(exerciseId, source) {
  const activity = getActivity(exerciseId);
  if (!activity) return failure('This activity is not available.');
  if (activity.inputType === 'jsx') {
    const result = checkExercise(source);
    return {
      passed: result.passed,
      message: result.message,
      checks: [
        {
          name: 'Text-only component',
          passed: result.runnable,
          detail: result.runnable
            ? 'The bounded JSX grammar accepts this component.'
            : result.message,
        },
        { name: 'Learning heading', passed: result.passed, detail: result.message },
      ],
      ...(result.heading ? { preview: result.heading } : {}),
    };
  }
  let config;
  try {
    config = parseConfig(source, activity.starter);
  } catch (error) {
    return failure(
      error instanceof SyntaxError
        ? 'The JSON could not be read. Check quotes, commas, and braces.'
        : error.message,
    );
  }
  const checks = [];
  try {
    simulate(exerciseId, config, (name, passed, detail) =>
      checks.push({ name, passed: Boolean(passed), detail }),
    );
  } catch {
    return failure(
      'The configuration cannot run this scenario. Use the field choices described in the prompt.',
    );
  }
  const passed = checks.length > 1 && checks.every((check) => check.passed);
  return {
    passed,
    message: passed
      ? 'Checkpoint passed. All synthetic scenario checks passed; apply this model in your project next.'
      : 'Some scenario checks need another change. Read each result and try one adjustment.',
    checks,
  };
}
