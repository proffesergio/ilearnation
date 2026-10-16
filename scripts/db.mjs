import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getStore,
  createNeonAdapter,
  LearningStore,
  syncLocalStore,
  getDatabaseReadiness,
} from '../packages/data/learning-store.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
if (existsSync(resolve(root, 'apps/web/.env.local')))
  process.loadEnvFile(resolve(root, 'apps/web/.env.local'));
const args = process.argv.slice(2);
const action = args[0] || 'status';
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};

let store;
let remote;
try {
  if (action === 'status') {
    const readiness = getDatabaseReadiness();
    console.log(
      JSON.stringify(
        { ...readiness, remoteSyncConfigured: Boolean(process.env.DATABASE_URL) },
        null,
        2,
      ),
    );
  } else if (action === 'sync') {
    if (!process.env.DATABASE_URL)
      throw new Error('Set DATABASE_URL for the remote target. No sync was attempted.');
    if (process.env.DATABASE_MODE !== 'sqlite')
      throw new Error(
        'Sync requires explicit DATABASE_MODE=sqlite and the intended LOCAL_DATABASE_PATH.',
      );
    store = await getStore();
    remote = new LearningStore(await createNeonAdapter(process.env.DATABASE_URL), {
      queueSync: false,
    });
    console.log(
      JSON.stringify(await syncLocalStore(store, remote, Number(option('limit') || 100))),
    );
  } else {
    store = await getStore();
    if (action === 'init') {
      if (store.adapter.kind === 'neon') {
        if (!args.includes('--apply'))
          throw new Error('Neon schema initialization requires the explicit --apply option.');
        await store.adapter.initialize();
      }
      console.log(`Initialized ${store.adapter.kind} learning schema.`);
    } else if (action === 'bootstrap-admin') {
      if (!option('email'))
        throw new Error('Use bootstrap-admin --email <operator-controlled-email>.');
      const user = await store.bootstrapAdmin(option('email'));
      console.log(JSON.stringify({ id: user.id, role: user.role, storage: store.adapter.kind }));
    } else if (action === 'invite') {
      if (!option('email') || !option('output'))
        throw new Error(
          'Use invite --email <email> --output <ignored-private-json-path>. The bearer link is written only to that file.',
        );
      const target = resolve(root, option('output'));
      // Refuse to overwrite another credential file.
      if (existsSync(target)) throw new Error('Output already exists; choose a new private path.');
      const invitation = await store.issueOperatorInvitation(
        option('email'),
        Number(option('hours') || 24),
      );
      const origin = new URL(process.env.AUTH_URL || 'http://127.0.0.1:3000').origin;
      writeFileSync(
        target,
        JSON.stringify(
          { ...invitation, email: option('email'), url: `${origin}/join#${invitation.token}` },
          null,
          2,
        ) + '\n',
        { mode: 0o600, flag: 'wx' },
      );
      console.log(
        JSON.stringify({ id: invitation.id, expiresAt: invitation.expiresAt, saved: target }),
      );
    } else
      throw new Error(
        'Commands: status | init [--apply] | bootstrap-admin --email <email> | invite --email <email> --output <path> [--hours 24] | sync [--limit 100].',
      );
  }
} catch (error) {
  // Database driver errors may include connection metadata; never print their text.
  const localError =
    error instanceof Error && !['NeonDbError', 'DatabaseError'].includes(error.name);
  console.error(
    localError &&
      (!process.env.DATABASE_URL || ['NOT_CONFIGURED', 'INVALID_INPUT'].includes(error.code))
      ? error.message
      : 'Database operation failed. Verify configuration and permissions; no credentials were printed.',
  );
  process.exitCode = 1;
} finally {
  store?.close();
  remote?.close();
}
