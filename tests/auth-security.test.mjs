import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAuthReadiness,
  assertSameOrigin,
  assertAuthRequest,
  readJson,
  errorResponse,
} from '../packages/auth/security.mjs';
import { StoreError } from '../packages/data/learning-store.mjs';

const env = {
  NODE_ENV: 'development',
  AUTH_SECRET: 'test-only-secret-that-has-more-than-32-characters',
  AUTH_URL: 'http://127.0.0.1:3000',
};
test('auth requires an explicit secret, trusted URL and suitable database', () => {
  assert.equal(getAuthReadiness(env).invitations, true);
  assert.equal(getAuthReadiness({ ...env, AUTH_SECRET: '' }).configured, false);
  assert.equal(getAuthReadiness({ ...env, AUTH_URL: 'http://attacker.test' }).configured, false);
  assert.equal(getAuthReadiness({ ...env, NODE_ENV: 'production' }).configured, false);
  assert.equal(
    getAuthReadiness({ ...env, AUTH_GOOGLE_ID: 'fixture', AUTH_GOOGLE_SECRET: 'fixture' }).google,
    true,
  );
  const localProduction = {
    ...env,
    NODE_ENV: 'production',
    ALLOW_INSECURE_LOCAL_AUTH: 'true',
    ALLOW_SQLITE_PRODUCTION: 'true',
    LOCAL_DATABASE_PATH: '/persistent/private.sqlite',
  };
  assert.equal(getAuthReadiness(localProduction).configured, true);
  assert.equal(getAuthReadiness({ ...localProduction, VERCEL: '1' }).configured, false);
  assert.equal(
    getAuthReadiness({ ...localProduction, AUTH_URL: 'http://remote.example' }).configured,
    false,
  );
});
test('authentication rejects a forged host even with trustHost enabled', () => {
  assert.doesNotThrow(() =>
    assertAuthRequest(new Request(env.AUTH_URL + '/api/auth/session'), env),
  );
  assert.throws(
    () => assertAuthRequest(new Request('https://attacker.test/api/auth/session'), env),
    { code: 'FORBIDDEN' },
  );
  assert.doesNotThrow(() =>
    assertAuthRequest(
      new Request('http://localhost:3000/api/auth/session', {
        headers: { host: '127.0.0.1:3000' },
      }),
      env,
    ),
  );
  assert.throws(
    () =>
      assertAuthRequest(
        new Request(env.AUTH_URL + '/api/auth/session', {
          headers: { host: 'attacker.test', 'x-forwarded-host': '127.0.0.1:3000' },
        }),
        env,
      ),
    { code: 'FORBIDDEN' },
  );
  assert.throws(
    () =>
      assertAuthRequest(
        new Request(env.AUTH_URL + '/api/auth/signin', {
          method: 'POST',
          headers: { origin: 'https://attacker.test' },
        }),
        env,
      ),
    { code: 'FORBIDDEN' },
  );
});
test('profile/account mutations reject missing or foreign origins', () => {
  assert.doesNotThrow(() =>
    assertSameOrigin(new Request(env.AUTH_URL, { headers: { origin: env.AUTH_URL } }), env),
  );
  assert.throws(() => assertSameOrigin(new Request(env.AUTH_URL), env), { code: 'FORBIDDEN' });
  assert.throws(
    () =>
      assertSameOrigin(
        new Request(env.AUTH_URL, { headers: { origin: 'https://other.test' } }),
        env,
      ),
    { code: 'FORBIDDEN' },
  );
});
test('bounded JSON parsing rejects excessive or malformed payloads', async () => {
  const request = (body) =>
    new Request(env.AUTH_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
  assert.deepEqual(await readJson(request('{"revision":1}')), { revision: 1 });
  await assert.rejects(readJson(request('{bad')), { code: 'INVALID_INPUT' });
  await assert.rejects(readJson(request('{"source":"' + 'x'.repeat(100) + '"}'), 20), {
    code: 'INVALID_INPUT',
  });
  await assert.rejects(readJson(request('[]')), { code: 'INVALID_INPUT' });
});
test('database failures return a generic unavailable response without driver secrets', async () => {
  const response = errorResponse(new Error('postgres://private-credential@example.test'));
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes('private-credential'), false);
  assert.equal(errorResponse(new StoreError('REVISION_CONFLICT')).status, 409);
});
