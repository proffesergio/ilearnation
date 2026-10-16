import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { SignJWT, jwtVerify } from 'jose';
import { ApiError } from './store.mjs';

const derive = promisify(scrypt);
export function credentials(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some((key) => !['email', 'password'].includes(key)))
    throw new ApiError(400, 'Provide only email and password.');
  const { email, password } = input;
  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    throw new ApiError(400, 'Provide a valid demo email.');
  if (typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password) > 128)
    throw new ApiError(400, 'Password must be 12–128 UTF-8 bytes.');
  return { email: email.trim().toLowerCase(), password };
}
export async function passwordHash(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt:${salt}:${key.toString('hex')}`;
}
export async function passwordMatches(password, stored) {
  const [, salt, expected] = stored.split(':');
  const key = await derive(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return timingSafeEqual(key, Buffer.from(expected, 'hex'));
}
export function createIdentity(secret, store) {
  if (typeof secret !== 'string' || Buffer.byteLength(secret) < 32)
    throw new Error('Provide a unique JWT_SECRET of at least 32 bytes.');
  const key = new TextEncoder().encode(secret);
  return {
    async token(user) {
      return new SignJWT({}).setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setSubject(user.id).setIssuer('field-notes-api').setAudience('field-notes-client')
        .setIssuedAt().setExpirationTime('15m').setJti(randomUUID()).sign(key);
    },
    async verify(token) {
      try {
        if (typeof token !== 'string' || token.length > 4096) throw new Error();
        const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'], issuer: 'field-notes-api', audience: 'field-notes-client', requiredClaims: ['sub', 'exp', 'iat'] });
        if (!payload.sub || !(await store.getUser(payload.sub))) throw new Error();
        return payload.sub;
      } catch { throw new ApiError(401, 'Sign in again to continue.'); }
    },
  };
}
