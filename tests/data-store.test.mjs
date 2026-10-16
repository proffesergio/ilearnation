import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  LearningStore,
  createSqliteAdapter,
  syncLocalStore,
  getDatabaseReadiness,
  createNeonAdapter,
} from '../packages/data/learning-store.mjs';
import { DEFAULT_POLICY } from '../packages/algorithm/index.mjs';

async function fixture(t, options = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'ilearn-sql-'));
  const path = join(dir, 'learning.sqlite');
  const adapter = await createSqliteAdapter(path);
  const store = new LearningStore(adapter, options);
  t.after(async () => {
    store.close();
    await rm(dir, { recursive: true, force: true });
  });
  return { store, adapter, path };
}
async function learner(store, email = 'learner@example.test') {
  const invitation = await store.issueOperatorInvitation(email);
  const user = await store.consumeInvitation(invitation.token);
  return store.saveProfile(
    user.id,
    { displayName: 'Learner', goal: 'Build a useful app', timezone: 'Asia/Dhaka' },
    0,
  );
}
const event = (userId, id = 'attempt-one') => ({
  id,
  userId,
  courseId: 'react-next',
  courseVersion: '0.2.0',
  chapterId: 'components',
  exerciseId: 'first-component',
  kind: 'checkpoint_passed',
});
const code = (expected) => (error) => error.code === expected;

test('SQLite query and transaction rows can cross React server component boundaries', async (t) => {
  const { adapter, store } = await fixture(t);
  assert.deepEqual(await adapter.query('SELECT 1 AS sample'), [{ sample: 1 }]);
  assert.deepEqual(await adapter.batch([{ sql: 'SELECT 2 AS sample' }]), [[{ sample: 2 }]]);
  const admin = await store.bootstrapAdmin('operator@example.test');
  const summary = await store.adminSummary(admin.id);
  assert.ok(summary.audit.length);
  assert.equal(Object.getPrototypeOf(summary.audit[0]), Object.prototype);
});

test('SQLite persists profiles and verified events across an actual database reopen', async (t) => {
  const { store, path } = await fixture(t);
  const user = await learner(store);
  await store.recordLearningEvent(event(user.id));
  const reopened = new LearningStore(await createSqliteAdapter(path));
  try {
    assert.equal((await reopened.getUser(user.id)).displayName, 'Learner');
    assert.deepEqual((await reopened.getProgress(user.id, 'react-next', '0.2.0')).passedChapters, [
      'components',
    ]);
  } finally {
    reopened.close();
  }
});

test('one-use invitations expire, can be revoked, and do not grant admin roles', async (t) => {
  let now = 1000;
  const { store } = await fixture(t, { now: () => now });
  const invite = await store.issueOperatorInvitation('one@example.test', 1);
  assert.equal((await store.consumeInvitation(invite.token)).role, 'learner');
  await assert.rejects(store.consumeInvitation(invite.token), code('INVALID_INVITATION'));
  const expired = await store.issueOperatorInvitation('two@example.test', 1);
  now += 3_600_001;
  await assert.rejects(store.consumeInvitation(expired.token), code('INVALID_INVITATION'));
  const admin = await store.bootstrapAdmin('operator@example.test');
  const revoked = await store.issueInvitation(admin.id, { email: 'three@example.test' });
  await store.revokeInvitation(admin.id, revoked.id);
  await assert.rejects(store.consumeInvitation(revoked.token), code('INVALID_INVITATION'));
});

test('concurrent invitation redemption has exactly one winner', async (t) => {
  const { store } = await fixture(t);
  const invitation = await store.issueOperatorInvitation('race@example.test');
  const results = await Promise.allSettled([
    store.consumeInvitation(invitation.token),
    store.consumeInvitation(invitation.token),
  ]);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
});

test('learning records isolate users/course versions and deduplicate attempt IDs', async (t) => {
  const { store } = await fixture(t);
  const one = await learner(store);
  const two = await learner(store, 'two@example.test');
  await store.recordLearningEvent(event(one.id));
  await store.recordLearningEvent(event(one.id));
  assert.equal((await store.exportUser(one.id)).events.length, 1);
  assert.deepEqual((await store.getProgress(two.id, 'react-next', '0.2.0')).passedChapters, []);
  assert.deepEqual((await store.getProgress(one.id, 'react-next', 'old')).passedChapters, []);
  await assert.rejects(store.recordLearningEvent(event(two.id)), code('EVENT_CONFLICT'));
  const incomplete = await store.consumeInvitation(
    (await store.issueOperatorInvitation('incomplete@example.test')).token,
  );
  await assert.rejects(
    store.getProgress(incomplete.id, 'react-next', '0.2.0'),
    code('PROFILE_REQUIRED'),
  );
  await assert.rejects(store.getProgress('missing', 'react-next', '0.2.0'), code('UNAUTHORIZED'));
});

test('profiles use optimistic revisions and cannot change SQL roles', async (t) => {
  const { store, adapter } = await fixture(t);
  const user = await learner(store);
  const before = (await adapter.query('SELECT COUNT(*) AS count FROM sync_outbox'))[0].count;
  await assert.rejects(
    store.saveProfile(user.id, { displayName: 'Stale' }, 0),
    code('REVISION_CONFLICT'),
  );
  assert.equal((await adapter.query('SELECT COUNT(*) AS count FROM sync_outbox'))[0].count, before);
  await store.saveProfile(user.id, { displayName: 'New name', role: 'admin' }, 1);
  assert.equal((await store.getUser(user.id)).role, 'learner');
  await assert.rejects(store.adminSummary(user.id), code('FORBIDDEN'));
  await assert.rejects(
    store.upsertGoogleUser({ sub: 'google1', email: user.email, emailVerified: false }),
    code('UNVERIFIED_EMAIL'),
  );
});

test('admin policy saves validate, increment versions, audit and enforce role', async (t) => {
  const { store } = await fixture(t, { now: () => 1000 });
  const admin = await store.bootstrapAdmin('admin@example.test');
  const user = await learner(store);
  await assert.rejects(store.savePolicy(user.id, DEFAULT_POLICY, 0), code('FORBIDDEN'));
  await assert.rejects(
    store.savePolicy(admin.id, { ...DEFAULT_POLICY, status: 'live' }, 0),
    code('INVALID_INPUT'),
  );
  const first = await store.savePolicy(admin.id, { ...DEFAULT_POLICY }, 0);
  assert.equal(first.version, 1);
  const second = await store.savePolicy(
    admin.id,
    { ...DEFAULT_POLICY, version: 2, rollbackTo: 1 },
    1,
  );
  assert.equal(second.version, 2);
  await assert.rejects(
    store.savePolicy(admin.id, { ...DEFAULT_POLICY }, 0),
    code('REVISION_CONFLICT'),
  );
  assert.equal(
    (await store.adminSummary(admin.id)).audit.filter((row) => row.action === 'policy_saved')
      .length,
    2,
  );
  const history = await store.listPolicyHistory(admin.id);
  assert.deepEqual(
    history.map((record) => record.version),
    [2, 1],
  );
  assert.equal(history[1].policy.rollbackTo, null);
  await store.savePolicy(
    admin.id,
    { ...history[1].policy, version: 3, rollbackTo: 1, changelog: 'Restore reviewed version one.' },
    2,
  );
  assert.equal((await store.getPolicy(admin.id)).policy.rollbackTo, 1);
  assert.equal((await store.listPolicyHistory(admin.id)).length, 3);
});

test('Google verified subjects cannot take over an existing email or migrate into another account', async (t) => {
  const { store } = await fixture(t);
  const one = await store.upsertGoogleUser({
    sub: 'google-one',
    email: 'one@example.test',
    emailVerified: true,
  });
  await assert.rejects(
    store.upsertGoogleUser({ sub: 'google-two', email: one.email, emailVerified: true }),
    code('IDENTITY_CONFLICT'),
  );
  await assert.rejects(
    store.upsertGoogleUser({ sub: 'google-one', email: 'two@example.test', emailVerified: true }),
  );
  assert.equal((await store.getUser(one.id)).email, 'one@example.test');
});

test('queued consecutive profile edits replay their optimistic revisions in order', async (t) => {
  const { store: local } = await fixture(t);
  const { store: remote } = await fixture(t, { queueSync: false });
  const user = await learner(local);
  await local.saveProfile(user.id, { displayName: 'Second revision' }, 1);
  await local.saveProfile(user.id, { displayName: 'Third revision' }, 2);
  const result = await syncLocalStore(local, remote);
  assert.equal(result.conflicts, 0);
  assert.equal((await remote.getUser(user.id)).revision, 3);
  assert.equal((await remote.getUser(user.id)).displayName, 'Third revision');
});

test('interrupted profile replay preserves a newer queued local edit', async (t) => {
  const { store: local } = await fixture(t);
  const { store: remote } = await fixture(t, { queueSync: false });
  const user = await learner(local);
  await local.saveProfile(user.id, { displayName: 'Newest local edit' }, 1);
  let profiles = 0;
  await assert.rejects(
    syncLocalStore(local, {
      async applySyncItem(item) {
        if (item.kind === 'profile' && ++profiles === 2) throw new Error('interrupted');
        return remote.applySyncItem(item);
      },
    }),
    /interrupted/,
  );
  assert.equal((await local.getUser(user.id)).displayName, 'Newest local edit');
  assert.equal((await local.getUser(user.id)).revision, 2);
  await syncLocalStore(local, remote);
  assert.equal((await remote.getUser(user.id)).displayName, 'Newest local edit');
});

test('sync reports conflicting global event IDs without copying another learner event', async (t) => {
  const { store: local } = await fixture(t);
  const { store: remote } = await fixture(t, { queueSync: false });
  const user = await learner(local);
  const other = await learner(remote, 'other@example.test');
  await remote.recordLearningEvent(event(other.id));
  await local.recordLearningEvent(event(user.id));
  assert.equal((await syncLocalStore(local, remote)).conflicts, 1);
  assert.equal((await remote.exportUser(user.id)).events.length, 0);
});

test('expired rate windows are pruned and active counters cannot be reset', async (t) => {
  let now = 1000;
  const { store, adapter } = await fixture(t, { now: () => now });
  await store.limited('one', 1, 100);
  await assert.rejects(store.limited('one', 1, 100), code('RATE_LIMITED'));
  now += 101;
  await store.limited('two', 1, 100);
  assert.equal((await adapter.query('SELECT COUNT(*) AS count FROM rate_limits'))[0].count, 1);
});

test('account export has bounded cursor pages with no missing or repeated IDs', async (t) => {
  const { store, adapter } = await fixture(t);
  const user = await learner(store);
  await adapter.batch(
    Array.from({ length: 1003 }, (_, index) => ({
      sql: 'INSERT INTO learning_events(id,user_id,course_id,course_version,chapter_id,exercise_id,kind,created_at) VALUES(?,?,?,?,?,?,?,?)',
      values: [
        `event-${String(index).padStart(4, '0')}`,
        user.id,
        'course',
        'v1',
        'chapter',
        'exercise',
        'lesson_read',
        index,
      ],
    })),
  );
  const first = await store.exportUser(user.id);
  assert.equal(first.events.length, 1000);
  assert.equal(first.pagination.hasMore, true);
  const second = await store.exportUser(user.id, { cursor: first.pagination.nextCursor });
  assert.equal(second.events.length, 3);
  assert.equal(second.pagination.hasMore, false);
  assert.equal(new Set([...first.events, ...second.events].map((row) => row.id)).size, 1003);
  const admin = await store.bootstrapAdmin('activity-admin@example.test');
  const recent = await store.getRecentActivity(admin.id, user.id, 2);
  assert.deepEqual(
    recent.events.map((row) => row.id),
    ['event-1002', 'event-1001'],
  );
  await assert.rejects(store.getRecentActivity(user.id, user.id), code('FORBIDDEN'));
});

test('local outbox survives a failed remote commit and replay is idempotent', async (t) => {
  const { store: local, adapter } = await fixture(t);
  const { store: remote } = await fixture(t, { queueSync: false });
  const user = await learner(local);
  await local.recordLearningEvent(event(user.id));
  const pending = (await adapter.query('SELECT COUNT(*) AS count FROM sync_outbox'))[0].count;
  await assert.rejects(
    syncLocalStore(local, {
      async applySyncItem() {
        throw new Error('offline');
      },
    }),
    /offline/,
  );
  assert.equal(
    (await adapter.query('SELECT COUNT(*) AS count FROM sync_outbox'))[0].count,
    pending,
  );
  // Simulate remote commit followed by a lost acknowledgement.
  let lost = false;
  await assert.rejects(
    syncLocalStore(local, {
      async applySyncItem(item) {
        const result = await remote.applySyncItem(item);
        if (!lost) {
          lost = true;
          throw new Error('ack lost');
        }
        return result;
      },
    }),
    /ack lost/,
  );
  assert.equal((await syncLocalStore(local, remote)).pending, 0);
  assert.equal((await remote.exportUser(user.id)).events.length, 1);
  assert.equal((await syncLocalStore(local, remote)).acknowledged, 0);
});

test('sync preserves remote identity/revision and never transfers local admin privileges', async (t) => {
  const { store: local } = await fixture(t);
  const { store: remote } = await fixture(t, { queueSync: false });
  const localUser = await learner(local, 'collision@example.test');
  await local.bootstrapAdmin(localUser.email);
  const remoteUser = await learner(remote, 'collision@example.test');
  await remote.saveProfile(remoteUser.id, { displayName: 'Remote current' }, 1);
  await local.recordLearningEvent(event(localUser.id));
  const result = await syncLocalStore(local, remote);
  assert.equal(result.conflicts, 1);
  assert.equal(await local.getUser(localUser.id), null);
  assert.equal((await local.getUser(remoteUser.id)).displayName, 'Remote current');
  assert.equal((await remote.getUser(remoteUser.id)).role, 'learner');
  assert.equal((await remote.exportUser(remoteUser.id)).events.length, 1);
});

test('deletion tombstones prevent replay from resurrecting accounts', async (t) => {
  const { store: local } = await fixture(t);
  const { store: remote } = await fixture(t, { queueSync: false });
  const user = await learner(local);
  await syncLocalStore(local, remote);
  await remote.deleteUser(user.id);
  await local.saveProfile(user.id, { displayName: 'Offline change' }, 1);
  await syncLocalStore(local, remote);
  assert.equal(await remote.getUser(user.id), null);
  assert.equal(await local.getUser(user.id), null);
  await assert.rejects(
    local.upsertGoogleUser({ sub: 'google-deleted', email: user.email, emailVerified: true }),
    code('ACCOUNT_DELETED'),
  );
});

test('deletion export includes only learner data and queues a remote tombstone', async (t) => {
  const { store: local } = await fixture(t);
  const { store: remote } = await fixture(t, { queueSync: false });
  const user = await learner(local);
  await local.recordLearningEvent(event(user.id));
  await syncLocalStore(local, remote);
  const exported = await local.exportUser(user.id);
  assert.equal(exported.events.length, 1);
  assert.equal(JSON.stringify(exported).includes('token_hash'), false);
  await local.deleteUser(user.id);
  await syncLocalStore(local, remote);
  assert.equal(await remote.getUser(user.id), null);
});

test('deleting before first sync tombstones stale user bootstrap on remote retry', async (t) => {
  const { store: local, adapter } = await fixture(t);
  const { store: remote } = await fixture(t, { queueSync: false });
  const user = await learner(local);
  const [queued] = await adapter.query("SELECT * FROM sync_outbox WHERE kind='user'");
  const stale = {
    id: queued.id,
    kind: 'user',
    userId: user.id,
    payload: JSON.parse(queued.payload),
  };
  await local.deleteUser(user.id);
  await syncLocalStore(local, remote);
  assert.equal(await remote.getUser(user.id), null);
  assert.equal((await remote.applySyncItem(stale)).status, 'deleted');
  assert.equal(await remote.getUser(user.id), null);
});

test('invalid Neon connection metadata never appears in thrown errors', async () => {
  await assert.rejects(
    createNeonAdapter('private-connection-token-not-a-url'),
    (error) =>
      error.code === 'NOT_CONFIGURED' && !error.message.includes('private-connection-token'),
  );
});

test('production database selection fails closed and Neon errors have no SQLite fallback', async () => {
  assert.equal(getDatabaseReadiness({ NODE_ENV: 'production', VERCEL: '1' }).ready, false);
  assert.equal(
    getDatabaseReadiness({
      NODE_ENV: 'production',
      ALLOW_SQLITE_PRODUCTION: 'true',
      LOCAL_DATABASE_PATH: '/persistent/data.sqlite',
    }).ready,
    true,
  );
  assert.equal(
    getDatabaseReadiness({
      NODE_ENV: 'production',
      VERCEL: '1',
      ALLOW_SQLITE_PRODUCTION: 'true',
      LOCAL_DATABASE_PATH: '/tmp/data.sqlite',
    }).ready,
    false,
  );
  const broken = new LearningStore({
    kind: 'neon',
    async query() {
      throw new Error('unavailable');
    },
    async batch() {
      throw new Error('unavailable');
    },
  });
  await assert.rejects(broken.getUser('known-user'), /unavailable/);
  await assert.rejects(broken.consumeInvitation('a'.repeat(43)), /unavailable/);
});
