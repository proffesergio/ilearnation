import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { getAuthReadiness } from '../packages/auth/security.mjs';
import { createNeonAdapter } from '../packages/data/learning-store.mjs';

export async function checkProduction(env = process.env, createAdapter = createNeonAdapter) {
  const production = { ...env, NODE_ENV: 'production', VERCEL: '1' };
  const readiness = getAuthReadiness(production);
  if (!readiness.configured || !readiness.invitations || production.DATABASE_MODE !== 'neon')
    throw new Error();
  const adapter = await createAdapter(production.DATABASE_URL);
  try {
    await adapter.batch(
      [
        'SELECT id,email,google_sub,display_name,goal,locale,timezone,role,revision,created_at FROM users LIMIT 0',
        'SELECT id,email,token_hash,expires_at,used_at,claim_id,revoked_at,issued_by,created_at FROM invitations LIMIT 0',
        'SELECT id,user_id,course_id,course_version,chapter_id,exercise_id,kind,created_at FROM learning_events LIMIT 0',
        'SELECT user_id,email_hash,deleted_at FROM tombstones LIMIT 0',
        'SELECT key,count,reset_at FROM rate_limits LIMIT 0',
        'SELECT id,version,body,updated_by,updated_at FROM policies LIMIT 0',
        'SELECT policy_id,version,body,updated_by,updated_at FROM policy_versions LIMIT 0',
        'SELECT id,actor_id,action,subject_id,created_at FROM audit_log LIMIT 0',
        'SELECT id,result,created_at FROM sync_receipts LIMIT 0',
      ].map((sql) => ({ sql })),
    );
  } finally {
    adapter.close?.();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  // A Vercel pull provides this ignored file. Never print its values.
  const file = '.vercel/.env.production.local';
  if (existsSync(file)) process.loadEnvFile(file);
  try {
    await checkProduction();
    console.log('Production account configuration and Neon schema checks passed.');
  } catch {
    console.error(
      'Production accounts are not ready. Configure Neon, AUTH_SECRET and an HTTPS AUTH_URL; initialize the approved schema before deploying. Google OAuth is optional and requires both credentials to enable.',
    );
    process.exitCode = 1;
  }
}
