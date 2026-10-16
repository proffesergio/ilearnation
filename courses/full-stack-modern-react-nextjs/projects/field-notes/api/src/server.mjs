import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { createApp, createMemoryStore, createMongoStore } from './app.mjs';
import { attachRealtime } from './realtime.mjs';

const port = Number(process.env.API_PORT || 4000);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Use an unprivileged API_PORT.');
const mode = process.env.STORE_MODE || 'memory';
if (!['memory', 'mongo'].includes(mode)) throw new Error('STORE_MODE must be memory or mongo.');
if (process.env.NODE_ENV === 'production' && mode !== 'mongo') throw new Error('Production requires an explicitly configured persistent Mongo store.');
const store = mode === 'mongo' ? await createMongoStore(process.env.MONGO_URL) : createMemoryStore();
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) throw new Error('Production requires JWT_SECRET.');
const app = createApp({ store, secret: process.env.JWT_SECRET || randomBytes(48).toString('base64url') });
const server = createServer(app);
const io = attachRealtime(server, app, { origin: process.env.WEB_ORIGIN || 'http://127.0.0.1:5173' });
server.listen(port, process.env.API_HOST || '127.0.0.1', () => console.log(`Field Notes API: http://127.0.0.1:${port} (${mode}, synthetic notes only)`));
let closing = false;
async function shutdown() {
  if (closing) return;
  closing = true;
  io.close();
  server.close();
  await store.close();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
