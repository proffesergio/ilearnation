import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createNeonAdapter } from '../packages/data/learning-store.mjs';

const envFile = fileURLToPath(new URL('../apps/web/.env.local', import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
// Provisioning is deliberately operator-controlled: this script never creates a Neon project.
if (!process.argv.includes('--apply')) {
  console.log(
    JSON.stringify(
      {
        configured: Boolean(process.env.DATABASE_URL),
        applied: false,
        next: 'Use Neon CLI to select the approved project/branch/database, store its connection string as DATABASE_URL, then run node scripts/neon-setup.mjs --apply to initialize the schema.',
      },
      null,
      2,
    ),
  );
} else if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing; no remote mutation was attempted.');
  process.exitCode = 1;
} else {
  try {
    const adapter = await createNeonAdapter(process.env.DATABASE_URL);
    await adapter.initialize();
    adapter.close();
    console.log('Neon learning schema initialized. No account roles were copied.');
  } catch {
    console.error('Neon schema initialization failed. Check the approved target and credentials.');
    process.exitCode = 1;
  }
}
