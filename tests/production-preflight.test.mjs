import test from 'node:test';
import assert from 'node:assert/strict';
import { checkProduction } from '../scripts/check-production.mjs';

const configured = {
  DATABASE_MODE: 'neon',
  DATABASE_URL: 'postgresql://fixture:fixture@example.test/fixture',
  AUTH_SECRET: 'test-only-secret-with-more-than-32-characters',
  AUTH_URL: 'https://ilearnation.example.test',
};

test('production preflight permits invitations with optional Google and probes every account table', async () => {
  for (const google of [
    {},
    { AUTH_GOOGLE_ID: 'fixture-id', AUTH_GOOGLE_SECRET: 'fixture-secret' },
  ]) {
    let closed = false;
    let probes;
    await checkProduction({ ...configured, ...google }, async (url) => {
      assert.equal(url, configured.DATABASE_URL);
      return {
        async batch(commands) {
          probes = commands.map(({ sql }) => sql.match(/FROM (\w+)/)[1]);
        },
        close() {
          closed = true;
        },
      };
    });
    assert.deepEqual(probes, [
      'users',
      'invitations',
      'learning_events',
      'tombstones',
      'rate_limits',
      'policies',
      'policy_versions',
      'audit_log',
      'sync_receipts',
    ]);
    assert.equal(closed, true);
  }
});

test('production preflight rejects missing core configuration and insecure URLs before connecting', async () => {
  for (const invalid of [
    { AUTH_SECRET: undefined },
    { AUTH_SECRET: 'too-short' },
    { AUTH_URL: undefined },
    { AUTH_URL: 'http://127.0.0.1:3000', ALLOW_INSECURE_LOCAL_AUTH: 'true' },
    { AUTH_URL: 'https://user:password@example.test' },
    { AUTH_URL: 'https://example.test/nested' },
    { DATABASE_URL: undefined },
    { DATABASE_MODE: 'sqlite' },
  ]) {
    let connected = false;
    await assert.rejects(
      checkProduction({ ...configured, ...invalid }, async () => {
        connected = true;
        return {};
      }),
    );
    assert.equal(connected, false, 'Invalid production configuration must not connect.');
  }
});

test('production preflight fails on a missing schema and always closes the adapter', async () => {
  let closed = false;
  await assert.rejects(
    checkProduction(configured, async () => ({
      async batch() {
        throw new Error('schema unavailable');
      },
      close() {
        closed = true;
      },
    })),
    /schema unavailable/,
  );
  assert.equal(closed, true);
});
