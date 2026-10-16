import { randomUUID } from 'node:crypto';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function noteInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new ApiError(400, 'Provide a note object.');
  if (Object.keys(input).some((key) => !['title', 'body', 'clientId'].includes(key)))
    throw new ApiError(400, 'Unknown note field.');
  const { title, body = '', clientId } = input;
  if (typeof title !== 'string' || !title.trim() || title.length > 120 || /[\u0000-\u001f]/.test(title))
    throw new ApiError(400, 'Title must contain 1–120 characters.');
  if (typeof body !== 'string' || body.length > 5000 || /\u0000/.test(body))
    throw new ApiError(400, 'Body must contain at most 5,000 characters.');
  if (clientId !== undefined && (typeof clientId !== 'string' || !/^[\w-]{1,80}$/.test(clientId)))
    throw new ApiError(400, 'Invalid client ID.');
  return { title: title.trim(), body: body.trim(), ...(clientId ? { clientId } : {}) };
}

const clone = (value) => structuredClone(value);
const slugFor = (title, id) => `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'note'}-${id}`;
const publicNote = (row) => row && Object.fromEntries(['id', 'title', 'body', 'slug', 'authorId', 'createdAt'].map((key) => [key, row[key]]));
function compatible(event, data) {
  if (event.note.title !== data.title || event.note.body !== data.body)
    throw new ApiError(409, 'Client ID was already used for different content.');
  return event;
}

/** All fixtures are synthetic; this adapter resets when its process stops. */
export function createMemoryStore({ now = () => new Date().toISOString() } = {}) {
  const users = new Map();
  const notes = new Map();
  const events = [];
  return {
    kind: 'memory',
    async createUser(user) {
      if ([...users.values()].some((row) => row.email === user.email)) throw new ApiError(409, 'Account already exists.');
      users.set(user.id, clone(user));
      return clone(user);
    },
    async findUser(email) { return clone([...users.values()].find((row) => row.email === email) || null); },
    async getUser(id) { return clone(users.get(id) || null); },
    async listNotes({ search = '', sort = 'newest', limit = 100 } = {}) {
      return [...notes.values()].filter((row) => `${row.title} ${row.body}`.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)) * (sort === 'oldest' ? 1 : -1))
        .slice(0, limit).map(clone);
    },
    async getNote(id) { return clone(notes.get(id) || [...notes.values()].find((row) => row.slug === id) || null); },
    async createNote({ authorId, ...input }) {
      const data = noteInput(input);
      const clientId = data.clientId || randomUUID();
      const previous = events.find((event) => event.authorId === authorId && event.clientId === clientId);
      if (previous) return clone(compatible(previous, data));
      const id = randomUUID();
      const note = { id, title: data.title, body: data.body, slug: slugFor(data.title, id), authorId, createdAt: now() };
      const event = { eventId: randomUUID(), sequence: events.length + 1, authorId, clientId, note, createdAt: now() };
      notes.set(id, clone(note));
      events.push(clone(event));
      return clone(event);
    },
    async updateNote(id, authorId, input) {
      const data = noteInput(input);
      const note = notes.get(id);
      if (!note) throw new ApiError(404, 'Note not found.');
      if (note.authorId !== authorId) throw new ApiError(403, 'Only the author can change this note.');
      Object.assign(note, { title: data.title, body: data.body });
      return clone(note);
    },
    async deleteNote(id, authorId) {
      const note = notes.get(id);
      if (!note) throw new ApiError(404, 'Note not found.');
      if (note.authorId !== authorId) throw new ApiError(403, 'Only the author can delete this note.');
      notes.delete(id);
    },
    async history(authorId, after = 0) {
      const rows = events.filter((event) => event.authorId === authorId && event.sequence > after).slice(0, 101);
      return { events: rows.slice(0, 100).map(clone), hasMore: rows.length > 100, nextCursor: rows.at(Math.min(rows.length, 100) - 1)?.sequence ?? after };
    },
    async stats() {
      const byDay = new Map();
      for (const note of notes.values()) {
        const day = note.createdAt.slice(0, 10);
        byDay.set(day, (byDay.get(day) || 0) + 1);
      }
      return { totalNotes: notes.size, byDay: [...byDay].sort(([a], [b]) => a.localeCompare(b)).map(([day, count]) => ({ day, count })) };
    },
    async close() {},
  };
}

/** Mongo transactions require a replica set. Never silently fall back to memory. */
export async function createMongoStore(uri) {
  if (typeof uri !== 'string' || !/^mongodb(?:\+srv)?:\/\//.test(uri)) throw new ApiError(503, 'Set a MongoDB connection URI.');
  const { default: mongoose } = await import('mongoose');
  const connection = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 5 }).asPromise();
  const { Schema } = mongoose;
  const userSchema = new Schema({ _id: String, email: { type: String, required: true, unique: true }, passwordHash: { type: String, required: true } }, { strict: 'throw', versionKey: false });
  const noteSchema = new Schema({ _id: String, id: { type: String, required: true, unique: true }, title: { type: String, required: true, maxlength: 120 }, body: { type: String, maxlength: 5000 }, slug: { type: String, required: true, unique: true }, authorId: { type: String, required: true }, createdAt: { type: String, required: true } }, { strict: 'throw', versionKey: false });
  const eventSchema = new Schema({ _id: String, eventId: String, sequence: { type: Number, required: true, unique: true }, authorId: String, clientId: String, note: { type: Schema.Types.Mixed, required: true }, createdAt: Date }, { versionKey: false });
  eventSchema.index({ authorId: 1, clientId: 1 }, { unique: true });
  eventSchema.index({ authorId: 1, sequence: 1 });
  const User = connection.model('User', userSchema);
  const Note = connection.model('Note', noteSchema);
  const Event = connection.model('NoteEvent', eventSchema);
  const Counter = connection.model('Counter', new Schema({ _id: String, value: Number }, { versionKey: false }));
  await Promise.all([User.init(), Note.init(), Event.init(), Counter.init()]);
  await Counter.updateOne({ _id: 'events' }, { $setOnInsert: { value: 0 } }, { upsert: true });
  const userView = (row) => row && ({ id: row._id, email: row.email, passwordHash: row.passwordHash });
  const eventView = (row) => row && ({ eventId: row.eventId, sequence: row.sequence, authorId: row.authorId, clientId: row.clientId, note: publicNote(row.note), createdAt: new Date(row.createdAt).toISOString() });
  return {
    kind: 'mongo',
    async createUser(user) {
      try { await User.create({ _id: user.id, email: user.email, passwordHash: user.passwordHash }); }
      catch (error) { if (error.code === 11000) throw new ApiError(409, 'Account already exists.'); throw error; }
      return user;
    },
    async findUser(email) { return userView(await User.findOne({ email }).lean()); },
    async getUser(id) { return userView(await User.findById(id).lean()); },
    async listNotes({ search = '', sort = 'newest', limit = 100 } = {}) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const filter = search ? { $or: [{ title: { $regex: escaped, $options: 'i' } }, { body: { $regex: escaped, $options: 'i' } }] } : {};
      return (await Note.find(filter).sort({ createdAt: sort === 'oldest' ? 1 : -1, id: sort === 'oldest' ? 1 : -1 }).limit(limit).lean()).map(publicNote);
    },
    async getNote(id) { return publicNote(await Note.findOne({ $or: [{ _id: id }, { slug: id }] }).lean()); },
    async createNote({ authorId, ...input }) {
      const data = noteInput(input);
      const clientId = data.clientId || randomUUID();
      const previous = await Event.findOne({ authorId, clientId }).lean();
      if (previous) return compatible(eventView(previous), data);
      let result;
      try {
        await connection.transaction(async (session) => {
          const existing = await Event.findOne({ authorId, clientId }).session(session).lean();
          if (existing) { result = compatible(eventView(existing), data); return; }
          const counter = await Counter.findOneAndUpdate({ _id: 'events' }, { $inc: { value: 1 } }, { session, new: true });
          const id = randomUUID();
          const createdAt = new Date().toISOString();
          const note = { id, title: data.title, body: data.body, slug: slugFor(data.title, id), authorId, createdAt };
          await Note.create([{ _id: id, ...note }], { session });
          result = { eventId: randomUUID(), sequence: counter.value, authorId, clientId, note, createdAt };
          await Event.create([{ _id: result.eventId, ...result }], { session });
        });
      } catch (error) {
        if (error.code === 11000) {
          const event = await Event.findOne({ authorId, clientId }).lean();
          if (event) return compatible(eventView(event), data);
        }
        throw error;
      }
      return result;
    },
    async updateNote(id, authorId, input) {
      const { title, body } = noteInput(input);
      const row = await Note.findOneAndUpdate({ _id: id, authorId }, { $set: { title, body } }, { new: true, runValidators: true }).lean();
      if (!row) { if (await Note.exists({ _id: id })) throw new ApiError(403, 'Only the author can change this note.'); throw new ApiError(404, 'Note not found.'); }
      return publicNote(row);
    },
    async deleteNote(id, authorId) {
      const row = await Note.findOneAndDelete({ _id: id, authorId });
      if (!row) { if (await Note.exists({ _id: id })) throw new ApiError(403, 'Only the author can delete this note.'); throw new ApiError(404, 'Note not found.'); }
    },
    async history(authorId, after = 0) {
      const rows = await Event.find({ authorId, sequence: { $gt: after } }).sort({ sequence: 1 }).limit(101).lean();
      const events = rows.slice(0, 100).map(eventView);
      return { events, hasMore: rows.length > 100, nextCursor: events.at(-1)?.sequence ?? after };
    },
    async stats() {
      const [result] = await Note.aggregate([{ $facet: { total: [{ $count: 'count' }], byDay: [{ $group: { _id: { $substrBytes: ['$createdAt', 0, 10] }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }, { $project: { _id: 0, day: '$_id', count: 1 } }] } }]);
      return { totalNotes: result.total[0]?.count || 0, byDay: result.byDay };
    },
    async close() { await connection.close(); },
  };
}
