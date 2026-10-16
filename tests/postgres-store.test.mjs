import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import {
  LearningStore,
  createSqliteAdapter,
  syncLocalStore,
} from '../packages/data/learning-store.mjs';
import { DEFAULT_POLICY } from '../packages/algorithm/index.mjs';

// Real embedded PostgreSQL exercises the same parameterized SQL as Neon HTTP.
// This does not test the Neon service, account, network, or hosted permissions.
test('PostgreSQL migrations, auth, policies and local-to-remote sync use compatible SQL', async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  const schema =
    (await readFile(
      new URL('../packages/data/migrations/001-learning.sql', import.meta.url),
      'utf8',
    )) +
    (await readFile(
      new URL('../packages/data/migrations/003-policy-history.sql', import.meta.url),
      'utf8',
    ));
  await db.exec(schema);
  await db.exec(schema);
  const pg = (sql) => {
    let index = 0;
    return sql.replace(/\?/g, () => `$${++index}`);
  };
  const adapter = {
    kind: 'neon',
    async query(sql, values = []) {
      return (await db.query(pg(sql), values)).rows;
    },
    async batch(commands) {
      return db.transaction(async (tx) => {
        const results = [];
        for (const { sql, values = [] } of commands)
          results.push((await tx.query(pg(sql), values)).rows);
        return results;
      });
    },
  };
  let now = 10_000;
  const remote = new LearningStore(adapter, { now: () => now });
  const local = new LearningStore(await createSqliteAdapter(':memory:'));
  t.after(() => local.close());
  const admin = await remote.bootstrapAdmin('pg-admin@example.test');
  const invitation = await remote.issueInvitation(admin.id, {
    email: 'pg-learner@example.test',
    expiresInHours: 1,
  });
  const user = await remote.consumeInvitation(invitation.token);
  await assert.rejects(remote.consumeInvitation(invitation.token), { code: 'INVALID_INVITATION' });
  await remote.saveProfile(user.id, { displayName: 'Postgres learner' }, 0);
  const expired = await remote.issueInvitation(admin.id, {
    email: 'pg-expired@example.test',
    expiresInHours: 1,
  });
  now += 3_600_001;
  await assert.rejects(remote.consumeInvitation(expired.token), { code: 'INVALID_INVITATION' });
  const google = await remote.upsertGoogleUser({
    sub: 'verified-pg-subject',
    email: 'google-pg@example.test',
    emailVerified: true,
  });
  assert.equal(google.role, 'learner');
  await assert.rejects(
    remote.upsertGoogleUser({ sub: 'another-subject', email: google.email, emailVerified: true }),
    { code: 'IDENTITY_CONFLICT' },
  );
  await remote.savePolicy(admin.id, { ...DEFAULT_POLICY }, 0);
  await remote.savePolicy(admin.id, { ...DEFAULT_POLICY, version: 2, rollbackTo: 1 }, 1);
  assert.deepEqual(
    (await remote.listPolicyHistory(admin.id)).map((row) => row.version),
    [2, 1],
  );
  await assert.rejects(remote.savePolicy(admin.id, { ...DEFAULT_POLICY }, 0), {
    code: 'REVISION_CONFLICT',
  });
  assert.equal(
    (await remote.adminSummary(admin.id)).audit.filter((row) => row.action === 'policy_saved')
      .length,
    2,
  );
  const localUser = await local.consumeInvitation(
    (await local.issueOperatorInvitation('pg-sync@example.test')).token,
  );
  await local.saveProfile(localUser.id, { displayName: 'Synced from SQLite' }, 0);
  const event = {
    id: 'pg-event',
    userId: localUser.id,
    courseId: 'course',
    courseVersion: 'v1',
    chapterId: 'chapter',
    exerciseId: 'exercise',
    kind: 'checkpoint_passed',
  };
  await local.recordLearningEvent(event);
  let lost = false;
  await assert.rejects(
    syncLocalStore(local, {
      async applySyncItem(item) {
        const result = await remote.applySyncItem(item);
        if (!lost) {
          lost = true;
          throw new Error('acknowledgement lost');
        }
        return result;
      },
    }),
    /lost/,
  );
  const sync = await syncLocalStore(local, remote);
  assert.equal(sync.pending, 0);
  assert.equal(sync.conflicts, 0);
  assert.equal((await remote.getUser(localUser.id)).displayName, 'Synced from SQLite');
  assert.deepEqual((await remote.getProgress(localUser.id, 'course', 'v1')).passedChapters, [
    'chapter',
  ]);
  await remote.recordLearningEvent(event);
  assert.equal((await remote.exportUser(localUser.id)).events.length, 1);
  await assert.rejects(remote.recordLearningEvent({ ...event, userId: user.id }), {
    code: 'EVENT_CONFLICT',
  });
  assert.equal(
    (await remote.listLearners(admin.id)).find((row) => row.id === localUser.id).passedCount,
    1,
  );
  assert.equal(
    (await remote.getRecentActivity(admin.id, localUser.id, 1)).events[0].id,
    'pg-event',
  );
  await local.deleteUser(localUser.id);
  await syncLocalStore(local, remote);
  assert.equal(await remote.getUser(localUser.id), null);
  await assert.rejects(
    remote.upsertGoogleUser({
      sub: 'deleted-pg',
      email: 'pg-sync@example.test',
      emailVerified: true,
    }),
    { code: 'ACCOUNT_DELETED' },
  );
});
