import { Server } from 'socket.io';
import { ApiError, noteInput } from './store.mjs';

export function attachRealtime(server, app, { origin = 'http://127.0.0.1:5173' } = {}) {
  const { identity, store } = app.locals;
  const io = new Server(server, { cors: { origin, methods: ['GET', 'POST'] }, maxHttpBufferSize: 16_384 });
  io.use(async (socket, next) => {
    try { socket.data.authorId = await identity.verify(socket.handshake.auth?.token); next(); }
    catch { next(new Error('Sign in to connect.')); }
  });
  io.on('connection', (socket) => {
    const authorId = socket.data.authorId;
    socket.join(authorId);
    let pending = 0;
    let budget = { count: 0, reset: Date.now() + 60_000 };
    const handle = (operation) => async (payload, acknowledge) => {
      const reply = typeof acknowledge === 'function' ? acknowledge : () => {};
      try {
        if (Date.now() > budget.reset) budget = { count: 0, reset: Date.now() + 60_000 };
        if (++budget.count > 90 || pending >= 4) throw new ApiError(429, 'Slow down and retry.');
        pending += 1;
        try {
          // Revalidate expiry and the current account on each action, not only connection.
          await identity.verify(socket.handshake.auth?.token);
          reply(await operation(payload));
        } finally { pending -= 1; }
      } catch (error) {
        const result = { ok: false, error: error instanceof ApiError ? error.message : 'Storage is unavailable. Retry later.' };
        socket.emit('note:error', result);
        reply(result);
      }
    };
    socket.on('note:create', handle(async (payload) => {
      const input = noteInput(payload);
      if (!input.clientId) throw new ApiError(400, 'Supply a stable client ID for retries.');
      const event = await store.createNote({ authorId, ...input });
      io.to(authorId).emit('note:created', event);
      return { ok: true, event };
    }));
    socket.on('notes:sync', handle(async (payload = {}) => {
      const after = payload?.after ?? 0;
      if (!Number.isSafeInteger(after) || after < 0) throw new ApiError(400, 'Use a nonnegative sequence cursor.');
      const result = await store.history(authorId, after);
      socket.emit('notes:history', result);
      return { ok: true, ...result };
    }));
  });
  return io;
}
