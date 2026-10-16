import { getDatabaseReadiness, StoreError } from '../data/learning-store.mjs';

export function getAuthReadiness(env = process.env) {
  const database = getDatabaseReadiness(env);
  let validUrl = false;
  try {
    const url = new URL(env.AUTH_URL);
    const localHttp =
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) &&
      !env.VERCEL &&
      (env.NODE_ENV !== 'production' || env.ALLOW_INSECURE_LOCAL_AUTH === 'true');
    validUrl =
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname === '/' &&
      (url.protocol === 'https:' || localHttp);
  } catch {}
  const configured =
    database.ready &&
    typeof env.AUTH_SECRET === 'string' &&
    env.AUTH_SECRET.length >= 32 &&
    validUrl;
  return {
    configured,
    google: configured && Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET),
    invitations: configured,
    message: configured
      ? env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
        ? 'Google and invitation sign-in are configured.'
        : 'Invitation sign-in is configured. Google needs OAuth credentials.'
      : 'Accounts need AUTH_SECRET (at least 32 characters), AUTH_URL, and an available configured database.',
  };
}

export function assertAuthRequest(request, env = process.env) {
  let expected;
  try {
    expected = new URL(env.AUTH_URL).origin;
  } catch {
    throw new StoreError('NOT_CONFIGURED');
  }
  // Next.js may expose an internal loopback URL behind its request adapter or
  // a TLS proxy. Validate the actual Host against our configured public host;
  // Auth.js then uses AUTH_URL for its canonical origin. Ignore forwarded hosts.
  const host = request.headers.get('host') || new URL(request.url).host;
  if (host !== new URL(expected).host)
    throw new StoreError('FORBIDDEN', 'Unexpected authentication host.');
  if (
    request.method !== 'GET' &&
    request.headers.has('origin') &&
    request.headers.get('origin') !== expected
  )
    throw new StoreError('FORBIDDEN');
}

export function assertSameOrigin(request, env = process.env) {
  let expected;
  try {
    expected = new URL(env.AUTH_URL).origin;
  } catch {
    throw new StoreError('NOT_CONFIGURED');
  }
  if (request.headers.get('origin') !== expected)
    throw new StoreError('FORBIDDEN', 'A same-origin request is required.');
  if (request.headers.get('sec-fetch-site') === 'cross-site') throw new StoreError('FORBIDDEN');
}

export async function readJson(request, maxBytes = 8192) {
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new StoreError('INVALID_INPUT', 'JSON is required.');
  const reader = request.body?.getReader();
  if (!reader) throw new StoreError('INVALID_INPUT');
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new StoreError('INVALID_INPUT', 'Request is too large.');
      }
      chunks.push(value);
    }
    const joined = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      joined.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const result = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(joined));
    if (!result || typeof result !== 'object' || Array.isArray(result))
      throw new StoreError('INVALID_INPUT');
    return result;
  } catch (error) {
    if (error instanceof StoreError) throw error;
    throw new StoreError('INVALID_INPUT', 'Invalid JSON.');
  }
}

export function errorResponse(error) {
  const codes = {
    UNAUTHORIZED: 401,
    PROFILE_REQUIRED: 403,
    FORBIDDEN: 403,
    NOT_CONFIGURED: 503,
    STORAGE_UNAVAILABLE: 503,
    INVALID_INPUT: 400,
    REVISION_CONFLICT: 409,
    EVENT_CONFLICT: 409,
    RATE_LIMITED: 429,
    INVALID_INVITATION: 400,
    ACCOUNT_DELETED: 403,
  };
  const status = error instanceof StoreError ? codes[error.code] || 400 : 503;
  const message =
    status === 503
      ? 'Account storage is unavailable. Try again later.'
      : error instanceof StoreError
        ? error.message
        : 'Request failed.';
  return Response.json(
    { error: message, code: error instanceof StoreError ? error.code : 'STORAGE_UNAVAILABLE' },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}
