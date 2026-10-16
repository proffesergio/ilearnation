import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { chmodSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { validatePolicy } from '../algorithm/index.mjs';

// Resolve from the operator/web working directory; a directory import.meta URL
// is treated as an asset request by the production Webpack build.
const root = /[\\/]apps[\\/]web$/.test(process.cwd())
  ? resolve(process.cwd(), '../..')
  : process.cwd();
const migrations = resolve(root, 'packages/data/migrations');
const migration =
  readFileSync(resolve(migrations, '001-learning.sql'), 'utf8') +
  readFileSync(resolve(migrations, '003-policy-history.sql'), 'utf8');
const localMigration = readFileSync(resolve(migrations, '002-local-outbox.sql'), 'utf8');
const hash = (value) => createHash('sha256').update(value).digest('hex');
const command = (sql, values = []) => ({ sql, values });

export class StoreError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = 'StoreError';
    this.code = code;
  }
}
const fail = (code, message) => {
  throw new StoreError(code, message);
};
function text(value, name, max = 160, optional = false) {
  if (optional && (value === undefined || value === null)) return '';
  if (
    typeof value !== 'string' ||
    value.trim().length < 1 ||
    value.length > max ||
    /[\u0000-\u001f\u007f]/.test(value)
  )
    fail('INVALID_INPUT', `Invalid ${name}.`);
  return value.trim();
}
function emailValue(value) {
  const email = text(value, 'email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('INVALID_INPUT', 'Invalid email.');
  return email;
}
function profileValue(value) {
  const displayName = text(value.displayName, 'display name', 80);
  const goal = value.goal ? text(value.goal, 'goal', 500) : '';
  const locale = text(value.locale || 'en', 'locale', 35);
  const timezone = text(value.timezone || 'UTC', 'timezone', 80);
  try {
    new Intl.DateTimeFormat(locale, { timeZone: timezone }).format();
  } catch {
    fail('INVALID_INPUT', 'Invalid locale or timezone.');
  }
  return { displayName, goal, locale, timezone };
}
function userView(row) {
  return row
    ? {
        id: row.id,
        email: row.email,
        displayName: row.display_name,
        goal: row.goal,
        locale: row.locale,
        timezone: row.timezone,
        role: row.role,
        revision: Number(row.revision),
      }
    : null;
}

export function getDatabaseReadiness(env = process.env) {
  const mode = env.DATABASE_MODE || (env.DATABASE_URL ? 'neon' : 'sqlite');
  if (!['sqlite', 'neon'].includes(mode))
    return { ready: false, mode, reason: 'DATABASE_MODE must be sqlite or neon.' };
  if (mode === 'neon' && !env.DATABASE_URL)
    return { ready: false, mode, reason: 'DATABASE_URL is required for Neon.' };
  if (
    mode === 'sqlite' &&
    env.NODE_ENV === 'production' &&
    (env.VERCEL ||
      env.ALLOW_SQLITE_PRODUCTION !== 'true' ||
      !env.LOCAL_DATABASE_PATH ||
      !isAbsolute(env.LOCAL_DATABASE_PATH))
  )
    return {
      ready: false,
      mode,
      reason:
        'Production requires Neon or an explicitly configured persistent SQLite host. Vercel requires Neon.',
    };
  return { ready: true, mode, reason: null };
}

export async function createSqliteAdapter(path) {
  const { DatabaseSync } = await import('node:sqlite');
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  if (path !== ':memory:') chmodSync(path, 0o600);
  db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;');
  db.exec(migration + localMigration);
  return {
    kind: 'sqlite',
    async query(sql, values = []) {
      // node:sqlite returns null-prototype records; React server boundaries
      // require ordinary serializable objects, as do the other SQL adapters.
      return db
        .prepare(sql)
        .all(...values)
        .map((row) => ({ ...row }));
    },
    async batch(commands) {
      db.exec('BEGIN IMMEDIATE');
      try {
        const results = commands.map(({ sql, values = [] }) =>
          db
            .prepare(sql)
            .all(...values)
            .map((row) => ({ ...row })),
        );
        db.exec('COMMIT');
        return results;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    close() {
      db.close();
    },
  };
}

export async function createNeonAdapter(url) {
  if (!url) fail('NOT_CONFIGURED', 'DATABASE_URL is required.');
  try {
    const parsed = new URL(url);
    if (
      !['postgres:', 'postgresql:'].includes(parsed.protocol) ||
      !parsed.hostname ||
      !parsed.username ||
      parsed.pathname.length < 2
    )
      throw new Error();
  } catch {
    fail('NOT_CONFIGURED', 'The Neon connection configuration is invalid.');
  }
  const { neon } = await import('@neondatabase/serverless');
  let sql;
  try {
    sql = neon(url);
  } catch {
    fail('NOT_CONFIGURED', 'The Neon connection configuration is invalid.');
  }
  const safe = async (operation) => {
    try {
      return await operation();
    } catch {
      fail('STORAGE_UNAVAILABLE', 'Account storage is unavailable.');
    }
  };
  const pg = (source) => {
    let n = 0;
    return source.replace(/\?/g, () => `$${++n}`);
  };
  return {
    kind: 'neon',
    query(source, values = []) {
      return safe(() =>
        sql.query(pg(source), values, {
          fetchOptions: { signal: AbortSignal.timeout(12_000) },
        }),
      );
    },
    batch(commands) {
      return safe(() =>
        sql.transaction(
          commands.map(({ sql: source, values = [] }) => sql.query(pg(source), values)),
          { isolationLevel: 'Serializable', fetchOptions: { signal: AbortSignal.timeout(12_000) } },
        ),
      );
    },
    async initialize() {
      const statements = migration
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);
      await safe(() => sql.transaction(statements.map((s) => sql.query(s))));
    },
    close() {},
  };
}

/** IDs must come from the authenticated server session, never a request body. */
export class LearningStore {
  constructor(adapter, { now = Date.now, queueSync = adapter.kind === 'sqlite' } = {}) {
    this.adapter = adapter;
    this.now = now;
    this.queueSync = queueSync && adapter.kind === 'sqlite';
  }
  async getUser(id) {
    return userView(
      (await this.adapter.query('SELECT * FROM users WHERE id=?', [text(id, 'user ID')]))[0],
    );
  }
  async requireUser(id, complete = false) {
    const user = await this.getUser(id);
    if (!user) fail('UNAUTHORIZED');
    if (complete && !user.displayName) fail('PROFILE_REQUIRED');
    return user;
  }
  async requireAdmin(id) {
    const user = await this.requireUser(id, true);
    if (user.role !== 'admin') fail('FORBIDDEN');
    return user;
  }
  outbox(kind, userId, payload, id = randomUUID()) {
    return command(
      'INSERT INTO sync_outbox(id,kind,user_id,payload,created_at) VALUES(?,?,?,?,?) ON CONFLICT(id) DO NOTHING',
      [id, kind, userId, JSON.stringify(payload), this.now()],
    );
  }
  async limited(key, limit = 20, windowMs = 60_000) {
    const now = this.now();
    // Remove at most 100 expired keys per call so maintenance stays bounded.
    await this.adapter.query(
      'DELETE FROM rate_limits WHERE key IN (SELECT key FROM rate_limits WHERE reset_at<=? LIMIT 100)',
      [now],
    );
    const [row] = await this.adapter.query(
      'INSERT INTO rate_limits(key,count,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.reset_at<=? THEN 1 ELSE rate_limits.count+1 END, reset_at=CASE WHEN rate_limits.reset_at<=? THEN ? ELSE rate_limits.reset_at END RETURNING count',
      [hash(key), now + windowMs, now, now, now + windowMs],
    );
    if (Number(row.count) > limit) fail('RATE_LIMITED');
  }
  async upsertGoogleUser({ sub, email, emailVerified }) {
    if (emailVerified !== true) fail('UNVERIFIED_EMAIL');
    const normalized = emailValue(email);
    const subject = text(sub, 'Google subject', 255);
    const tombstone = await this.adapter.query(
      'SELECT user_id FROM tombstones WHERE email_hash=?',
      [hash(normalized)],
    );
    if (tombstone.length) fail('ACCOUNT_DELETED');
    const id = randomUUID();
    // Link an email only after Google has attested that it is verified. Do not overwrite a different Google identity.
    const commands = [
      command(
        'INSERT INTO users(id,email,google_sub,created_at) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM tombstones WHERE email_hash=?) ON CONFLICT(email) DO UPDATE SET google_sub=COALESCE(users.google_sub,excluded.google_sub) WHERE NOT EXISTS(SELECT 1 FROM tombstones WHERE email_hash=?) RETURNING id',
        [id, normalized, subject, this.now(), hash(normalized), hash(normalized)],
      ),
    ];
    if (this.queueSync)
      commands.push(
        command(
          "INSERT INTO sync_outbox(id,kind,user_id,payload,created_at) SELECT ?,'user',id,json_object('userId',id,'email',email),? FROM users WHERE email=? AND google_sub=? ON CONFLICT(id) DO NOTHING",
          [`user:${hash(normalized)}`, this.now(), normalized, subject],
        ),
      );
    await this.adapter.batch(commands);
    const [row] = await this.adapter.query('SELECT * FROM users WHERE google_sub=? AND email=?', [
      subject,
      normalized,
    ]);
    if (!row) fail('IDENTITY_CONFLICT');
    return userView(row);
  }
  async saveProfile(userId, value, expectedRevision) {
    const user = await this.requireUser(userId);
    const profile = profileValue(value);
    const revision = expectedRevision ?? user.revision;
    if (!Number.isSafeInteger(revision) || revision < 0) fail('INVALID_INPUT', 'Invalid revision.');
    const commands = [];
    if (this.queueSync)
      commands.push(
        command(
          'INSERT INTO sync_outbox(id,kind,user_id,payload,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM users WHERE id=? AND revision=?)',
          [
            randomUUID(),
            'profile',
            userId,
            JSON.stringify({ userId, email: user.email, profile, expectedRevision: revision }),
            this.now(),
            userId,
            revision,
          ],
        ),
      );
    commands.push(
      command(
        'UPDATE users SET display_name=?,goal=?,locale=?,timezone=?,revision=revision+1 WHERE id=? AND revision=? RETURNING *',
        [profile.displayName, profile.goal, profile.locale, profile.timezone, userId, revision],
      ),
    );
    const results = await this.adapter.batch(commands);
    const rows = results.at(-1);
    if (!rows.length) fail('REVISION_CONFLICT', 'Profile changed. Reload before saving.');
    return userView(rows[0]);
  }
  async issueInvitation(actorId, { email, expiresInHours = 24 }) {
    await this.requireAdmin(actorId);
    await this.limited(`issue:${actorId}`, 10, 3_600_000);
    return this.issueOperatorInvitation(email, expiresInHours, actorId);
  }
  /** Operator-only: never exposed as an HTTP action. */
  async issueOperatorInvitation(email, expiresInHours = 24, actorId = 'local-operator') {
    const normalized = emailValue(email);
    if (!Number.isFinite(expiresInHours) || expiresInHours <= 0 || expiresInHours > 168)
      fail('INVALID_INPUT');
    const token = randomBytes(32).toString('base64url');
    const id = randomUUID();
    const now = this.now();
    await this.adapter.batch([
      command(
        'INSERT INTO invitations(id,email,token_hash,expires_at,issued_by,created_at) VALUES(?,?,?,?,?,?)',
        [id, normalized, hash(token), now + expiresInHours * 3_600_000, actorId, now],
      ),
      command('INSERT INTO audit_log(id,actor_id,action,subject_id,created_at) VALUES(?,?,?,?,?)', [
        randomUUID(),
        actorId,
        'invitation_issued',
        id,
        now,
      ]),
    ]);
    return { id, token, expiresAt: now + expiresInHours * 3_600_000 };
  }
  async revokeInvitation(actorId, id) {
    await this.requireAdmin(actorId);
    await this.adapter.batch([
      command('UPDATE invitations SET revoked_at=? WHERE id=?', [
        this.now(),
        text(id, 'invitation ID'),
      ]),
      command('INSERT INTO audit_log(id,actor_id,action,subject_id,created_at) VALUES(?,?,?,?,?)', [
        randomUUID(),
        actorId,
        'invitation_revoked',
        id,
        this.now(),
      ]),
    ]);
  }
  async consumeInvitation(token) {
    if (typeof token !== 'string' || !/^[\w-]{43}$/.test(token)) fail('INVALID_INVITATION');
    const digest = hash(token);
    const now = this.now();
    const id = randomUUID();
    const [invitation] = await this.adapter.query(
      'SELECT email FROM invitations WHERE token_hash=?',
      [digest],
    );
    if (!invitation) fail('INVALID_INVITATION');
    // Claim, user creation, and final selection share one SQL transaction.
    const commands = [
      command(
        'UPDATE invitations SET used_at=?,claim_id=? WHERE token_hash=? AND used_at IS NULL AND revoked_at IS NULL AND expires_at>? AND NOT EXISTS(SELECT 1 FROM tombstones WHERE email_hash=?) RETURNING email',
        [now, id, digest, now, hash(invitation.email)],
      ),
      command(
        'INSERT INTO users(id,email,created_at) SELECT ?,email,? FROM invitations WHERE token_hash=? AND claim_id=? ON CONFLICT(email) DO NOTHING',
        [id, now, digest, id],
      ),
      command(
        'SELECT users.* FROM users JOIN invitations ON users.email=invitations.email WHERE invitations.token_hash=? AND invitations.claim_id=?',
        [digest, id],
      ),
    ];
    if (this.queueSync)
      commands.push(
        command(
          "INSERT INTO sync_outbox(id,kind,user_id,payload,created_at) SELECT ?,'user',users.id,json_object('userId',users.id,'email',users.email),? FROM users JOIN invitations ON users.email=invitations.email WHERE invitations.token_hash=? AND invitations.claim_id=? ON CONFLICT(id) DO NOTHING",
          [`user:${hash(invitation.email)}`, now, digest, id],
        ),
      );
    const results = await this.adapter.batch(commands);
    const row = results[2][0];
    if (!row) fail('INVALID_INVITATION');
    return userView(row);
  }
  async getProgress(userId, courseId, courseVersion) {
    await this.requireUser(userId, true);
    text(courseId, 'course ID');
    text(courseVersion, 'course version');
    const rows = await this.adapter.query(
      'SELECT chapter_id,kind FROM learning_events WHERE user_id=? AND course_id=? AND course_version=? GROUP BY chapter_id,kind LIMIT 2000',
      [userId, courseId, courseVersion],
    );
    const pending = this.queueSync
      ? await this.adapter.query('SELECT COUNT(*) AS count FROM sync_outbox WHERE user_id=?', [
          userId,
        ])
      : [{ count: 0 }];
    return {
      readChapters: [
        ...new Set(rows.filter((r) => r.kind === 'lesson_read').map((r) => r.chapter_id)),
      ],
      passedChapters: [
        ...new Set(rows.filter((r) => r.kind === 'checkpoint_passed').map((r) => r.chapter_id)),
      ],
      storage: this.adapter.kind,
      pendingSync: Number(pending[0].count),
    };
  }
  async recordLearningEvent(input) {
    const user = await this.requireUser(input.userId, true);
    const event = Object.fromEntries(
      ['id', 'userId', 'courseId', 'courseVersion', 'chapterId', 'exerciseId', 'kind'].map(
        (key) => [key, text(input[key], key)],
      ),
    );
    if (!['lesson_read', 'checkpoint_passed', 'checkpoint_failed'].includes(event.kind))
      fail('INVALID_INPUT');
    const existing = await this.adapter.query('SELECT * FROM learning_events WHERE id=?', [
      event.id,
    ]);
    if (
      existing.length &&
      (existing[0].user_id !== event.userId ||
        existing[0].course_id !== event.courseId ||
        existing[0].course_version !== event.courseVersion ||
        existing[0].chapter_id !== event.chapterId ||
        existing[0].exercise_id !== event.exerciseId ||
        existing[0].kind !== event.kind)
    )
      fail('EVENT_CONFLICT');
    const createdAt = this.now();
    const commands = [
      command(
        'INSERT INTO learning_events(id,user_id,course_id,course_version,chapter_id,exercise_id,kind,created_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET id=excluded.id WHERE learning_events.user_id=excluded.user_id AND learning_events.course_id=excluded.course_id AND learning_events.course_version=excluded.course_version AND learning_events.chapter_id=excluded.chapter_id AND learning_events.exercise_id=excluded.exercise_id AND learning_events.kind=excluded.kind RETURNING id',
        [
          event.id,
          event.userId,
          event.courseId,
          event.courseVersion,
          event.chapterId,
          event.exerciseId,
          event.kind,
          createdAt,
        ],
      ),
    ];
    if (this.queueSync)
      commands.push(
        command(
          'INSERT INTO sync_outbox(id,kind,user_id,payload,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM learning_events WHERE id=? AND user_id=? AND course_id=? AND course_version=? AND chapter_id=? AND exercise_id=? AND kind=?) ON CONFLICT(id) DO NOTHING',
          [
            `event:${event.id}`,
            'event',
            event.userId,
            JSON.stringify({ ...event, email: user.email, createdAt }),
            createdAt,
            event.id,
            event.userId,
            event.courseId,
            event.courseVersion,
            event.chapterId,
            event.exerciseId,
            event.kind,
          ],
        ),
      );
    const [inserted] = await this.adapter.batch(commands);
    if (!inserted.length) fail('EVENT_CONFLICT');
    return this.getProgress(event.userId, event.courseId, event.courseVersion);
  }
  async listLearners(actorId) {
    await this.requireAdmin(actorId);
    return (
      await this.adapter.query(
        "SELECT users.*, activity.last_active_at,activity.passed_count,activity.read_count,activity.attempt_count FROM users LEFT JOIN (SELECT user_id,MAX(created_at) AS last_active_at,COUNT(DISTINCT CASE WHEN kind='checkpoint_passed' THEN course_id || ':' || course_version || ':' || chapter_id END) AS passed_count,COUNT(DISTINCT CASE WHEN kind='lesson_read' THEN course_id || ':' || course_version || ':' || chapter_id END) AS read_count,SUM(CASE WHEN kind IN ('checkpoint_passed','checkpoint_failed') THEN 1 ELSE 0 END) AS attempt_count FROM learning_events GROUP BY user_id) AS activity ON users.id=activity.user_id ORDER BY users.created_at DESC LIMIT 100",
      )
    ).map((row) => ({
      ...userView(row),
      lastActiveAt: row.last_active_at ? Number(row.last_active_at) : null,
      passedCount: Number(row.passed_count || 0),
      readCount: Number(row.read_count || 0),
      attemptCount: Number(row.attempt_count || 0),
    }));
  }
  async getRecentActivity(actorId, learnerId, limit = 1000) {
    await this.requireAdmin(actorId);
    const user = await this.requireUser(learnerId);
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) fail('INVALID_INPUT');
    const events = await this.adapter.query(
      'SELECT id,course_id,course_version,chapter_id,exercise_id,kind,created_at FROM learning_events WHERE user_id=? ORDER BY created_at DESC,id DESC LIMIT ?',
      [learnerId, limit],
    );
    return { user, events };
  }
  async adminSummary(actorId) {
    await this.requireAdmin(actorId);
    const [counts, events, audit] = await this.adapter.batch([
      command('SELECT COUNT(*) AS learners FROM users'),
      command('SELECT kind,COUNT(*) AS count FROM learning_events GROUP BY kind'),
      command(
        'SELECT id,actor_id,action,subject_id,created_at FROM audit_log ORDER BY created_at DESC LIMIT 50',
      ),
    ]);
    return {
      learners: Number(counts[0].learners),
      events: events.map((r) => ({ kind: r.kind, count: Number(r.count) })),
      audit,
      storage: this.adapter.kind,
    };
  }
  async getPolicy(actorId, id = 'learning-policy') {
    await this.requireAdmin(actorId);
    const [row] = await this.adapter.query('SELECT * FROM policies WHERE id=?', [
      text(id, 'policy ID'),
    ]);
    return row
      ? {
          id: row.id,
          version: Number(row.version),
          policy: JSON.parse(row.body),
          updatedBy: row.updated_by,
          updatedAt: Number(row.updated_at),
        }
      : null;
  }
  async listPolicyHistory(actorId, limit = 20) {
    await this.requireAdmin(actorId);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) fail('INVALID_INPUT');
    return (
      await this.adapter.query(
        'SELECT * FROM policy_versions ORDER BY updated_at DESC,version DESC LIMIT ?',
        [limit],
      )
    ).map((row) => ({
      id: row.policy_id,
      version: Number(row.version),
      policy: JSON.parse(row.body),
      updatedBy: row.updated_by,
      updatedAt: Number(row.updated_at),
    }));
  }
  async savePolicy(actorId, policy, expectedVersion = 0, id = 'learning-policy') {
    await this.requireAdmin(actorId);
    text(id, 'policy ID');
    const body = JSON.stringify(policy);
    if (body.length > 16_384 || !policy || typeof policy !== 'object' || Array.isArray(policy))
      fail('INVALID_INPUT');
    if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 0) fail('INVALID_INPUT');
    const validation = validatePolicy(policy);
    if (!validation.success) fail('INVALID_INPUT', validation.errors.join(' '));
    if (policy.version !== expectedVersion + 1)
      fail('INVALID_INPUT', 'Policy version must follow the saved revision.');
    const now = this.now();
    const results = await this.adapter.batch([
      command(
        'INSERT INTO audit_log(id,actor_id,action,subject_id,created_at) SELECT ?,?,?,?,? WHERE (?=0 AND NOT EXISTS(SELECT 1 FROM policies WHERE id=?)) OR EXISTS(SELECT 1 FROM policies WHERE id=? AND version=?)',
        [randomUUID(), actorId, 'policy_saved', id, now, expectedVersion, id, id, expectedVersion],
      ),
      command(
        'INSERT INTO policies(id,version,body,updated_by,updated_at) SELECT ?,?,?,?,? WHERE ?=0 OR EXISTS(SELECT 1 FROM policies WHERE id=? AND version=?) ON CONFLICT(id) DO UPDATE SET version=policies.version+1,body=excluded.body,updated_by=excluded.updated_by,updated_at=excluded.updated_at WHERE policies.version=? RETURNING *',
        [
          id,
          expectedVersion + 1,
          body,
          actorId,
          now,
          expectedVersion,
          id,
          expectedVersion,
          expectedVersion,
        ],
      ),
      command(
        'INSERT INTO policy_versions(policy_id,version,body,updated_by,updated_at) SELECT id,version,body,updated_by,updated_at FROM policies WHERE id=? AND version=? ON CONFLICT(policy_id,version) DO NOTHING',
        [id, expectedVersion + 1],
      ),
    ]);
    const rows = results[1];
    if (!rows.length) fail('REVISION_CONFLICT');
    return this.getPolicy(actorId, id);
  }
  async exportUser(userId, { cursor } = {}) {
    const user = await this.requireUser(userId);
    if (cursor !== undefined) text(cursor, 'export cursor');
    const rows = await this.adapter.query(
      'SELECT id,course_id,course_version,chapter_id,exercise_id,kind,created_at FROM learning_events WHERE user_id=? AND id>? ORDER BY id LIMIT 1001',
      [userId, cursor || ''],
    );
    const events = rows.slice(0, 1000);
    const hasMore = rows.length > 1000;
    return {
      exportedAt: new Date(this.now()).toISOString(),
      user,
      events,
      pagination: { limit: 1000, hasMore, nextCursor: hasMore ? events.at(-1).id : null },
    };
  }
  async deleteUser(userId) {
    const user = await this.requireUser(userId);
    const now = this.now();
    const commands = [
      command(
        'INSERT INTO tombstones(user_id,email_hash,deleted_at) VALUES(?,?,?) ON CONFLICT(user_id) DO NOTHING',
        [userId, hash(user.email), now],
      ),
      command('UPDATE invitations SET revoked_at=? WHERE email=?', [now, user.email]),
      command('DELETE FROM users WHERE id=?', [userId]),
    ];
    if (this.queueSync) {
      commands.push(command('DELETE FROM sync_outbox WHERE user_id=?', [userId]));
      commands.push(
        this.outbox('delete', userId, {
          userId,
          email: user.email,
          emailHash: hash(user.email),
          deletedAt: now,
        }),
      );
    }
    await this.adapter.batch(commands);
  }
  /** Trusted local operator only. No web route calls this. Roles never enter sync payloads. */
  async bootstrapAdmin(email) {
    const normalized = emailValue(email);
    const now = this.now();
    const id = randomUUID();
    if (
      (
        await this.adapter.query('SELECT user_id FROM tombstones WHERE email_hash=?', [
          hash(normalized),
        ])
      ).length
    )
      fail('ACCOUNT_DELETED');
    await this.adapter.batch([
      command(
        'INSERT INTO users(id,email,display_name,role,created_at) VALUES(?,?,?, ?,?) ON CONFLICT(email) DO UPDATE SET role=excluded.role',
        [id, normalized, 'Administrator', 'admin', now],
      ),
      command('INSERT INTO audit_log(id,actor_id,action,subject_id,created_at) VALUES(?,?,?,?,?)', [
        randomUUID(),
        'local-operator',
        'admin_bootstrap',
        hash(normalized),
        now,
      ]),
    ]);
    return userView(
      (await this.adapter.query('SELECT * FROM users WHERE email=?', [normalized]))[0],
    );
  }
  /** Called only by a trusted operator sync process, never an HTTP endpoint. */
  async applySyncItem(item) {
    const receiptId = text(item.id, 'sync ID');
    const payload = item.payload;
    if (!['user', 'profile', 'event', 'delete'].includes(item.kind)) fail('INVALID_INPUT');
    const email = emailValue(payload.email);
    const userId = text(payload.userId, 'user ID');
    const now = this.now();
    const existing = await this.adapter.query('SELECT result FROM sync_receipts WHERE id=?', [
      receiptId,
    ]);
    if (existing.length) {
      const [user] = await this.adapter.query('SELECT * FROM users WHERE email=?', [email]);
      return { status: user ? existing[0].result : 'deleted', user: userView(user) || undefined };
    }
    const commands = [];
    const tombstone = await this.adapter.query(
      'SELECT user_id FROM tombstones WHERE email_hash=? OR user_id=?',
      [hash(email), userId],
    );
    if (tombstone.length && item.kind !== 'delete') {
      await this.adapter.query(
        'INSERT INTO sync_receipts(id,result,created_at) VALUES(?,?,?) ON CONFLICT(id) DO NOTHING',
        [receiptId, 'deleted', now],
      );
      return { status: 'deleted', reason: 'Remote deletion prevents local resurrection.' };
    }
    if (item.kind === 'delete') {
      commands.push(
        command(
          'INSERT INTO tombstones(user_id,email_hash,deleted_at) SELECT COALESCE((SELECT id FROM users WHERE email=?),?),?,? ON CONFLICT(email_hash) DO NOTHING',
          [email, userId, hash(email), now],
        ),
      );
      commands.push(command('UPDATE invitations SET revoked_at=? WHERE email=?', [now, email]));
      commands.push(command('DELETE FROM users WHERE email=?', [email]));
      commands.push(
        command(
          'INSERT INTO sync_receipts(id,result,created_at) VALUES(?,?,?) ON CONFLICT(id) DO NOTHING',
          [receiptId, 'deleted', now],
        ),
      );
    } else {
      // Sync never copies Google subjects, invitations, tokens, policies, or roles.
      commands.push(
        command(
          'INSERT INTO users(id,email,created_at) SELECT ?,?,? WHERE NOT EXISTS(SELECT 1 FROM tombstones WHERE email_hash=?) ON CONFLICT(email) DO NOTHING',
          [userId, email, now, hash(email)],
        ),
      );
      if (item.kind === 'profile') {
        const profile = profileValue(payload.profile);
        const expected = payload.expectedRevision;
        if (!Number.isSafeInteger(expected) || expected < 0) fail('INVALID_INPUT');
        commands.push(
          command(
            "INSERT INTO sync_receipts(id,result,created_at) SELECT ?,CASE WHEN revision=? THEN 'applied' ELSE 'conflict' END,? FROM users WHERE email=? ON CONFLICT(id) DO NOTHING",
            [receiptId, expected, now, email],
          ),
        );
        commands.push(
          command(
            "UPDATE users SET display_name=?,goal=?,locale=?,timezone=?,revision=revision+1 WHERE email=? AND revision=? AND EXISTS(SELECT 1 FROM sync_receipts WHERE id=? AND result='applied')",
            [
              profile.displayName,
              profile.goal,
              profile.locale,
              profile.timezone,
              email,
              expected,
              receiptId,
            ],
          ),
        );
      } else {
        if (item.kind === 'event') {
          if (!['lesson_read', 'checkpoint_passed', 'checkpoint_failed'].includes(payload.kind))
            fail('INVALID_INPUT');
          const values = ['id', 'courseId', 'courseVersion', 'chapterId', 'exerciseId', 'kind'].map(
            (key) => text(payload[key], key),
          );
          commands.push(
            command(
              "INSERT INTO sync_receipts(id,result,created_at) SELECT ?,CASE WHEN EXISTS(SELECT 1 FROM learning_events WHERE id=?) AND NOT EXISTS(SELECT 1 FROM learning_events JOIN users ON users.id=learning_events.user_id WHERE learning_events.id=? AND users.email=? AND course_id=? AND course_version=? AND chapter_id=? AND exercise_id=? AND kind=?) THEN 'conflict' ELSE 'applied' END,? ON CONFLICT(id) DO NOTHING",
              [
                receiptId,
                values[0],
                values[0],
                email,
                values[1],
                values[2],
                values[3],
                values[4],
                values[5],
                now,
              ],
            ),
          );
          commands.push(
            command(
              "INSERT INTO learning_events(id,user_id,course_id,course_version,chapter_id,exercise_id,kind,created_at) SELECT ?,id,?,?,?,?,?,? FROM users WHERE email=? AND EXISTS(SELECT 1 FROM sync_receipts WHERE id=? AND result='applied') ON CONFLICT(id) DO NOTHING",
              [
                values[0],
                values[1],
                values[2],
                values[3],
                values[4],
                values[5],
                Number.isSafeInteger(payload.createdAt) ? payload.createdAt : now,
                email,
                receiptId,
              ],
            ),
          );
        }
        commands.push(
          command(
            "INSERT INTO sync_receipts(id,result,created_at) SELECT ?,'applied',? WHERE EXISTS(SELECT 1 FROM users WHERE email=?) ON CONFLICT(id) DO NOTHING",
            [receiptId, now, email],
          ),
        );
      }
    }
    // Remote mutations and their deduplication receipt commit together.
    await this.adapter.batch(commands);
    const [receipt] = await this.adapter.query('SELECT result FROM sync_receipts WHERE id=?', [
      receiptId,
    ]);
    const [user] = await this.adapter.query('SELECT * FROM users WHERE email=?', [email]);
    if (!receipt) fail('SYNC_CONFLICT', 'Remote user was deleted during synchronization.');
    return {
      status: receipt.result,
      user: userView(user) || undefined,
      ...(receipt.result === 'conflict'
        ? { reason: 'Remote profile revision wins; local edit was not applied.' }
        : {}),
    };
  }
  close() {
    this.adapter.close?.();
  }
}

/** Bounded, sequential replay. Errors leave the unacknowledged item and later items intact. */
export async function syncLocalStore(local, remote, limit = 100) {
  if (local.adapter.kind !== 'sqlite' || !Number.isInteger(limit) || limit < 1 || limit > 500)
    fail('INVALID_INPUT');
  const pendingRows = await local.adapter.query(
    'SELECT * FROM sync_outbox ORDER BY sequence LIMIT ?',
    [limit],
  );
  let acknowledged = 0;
  let conflicts = 0;
  for (const row of pendingRows) {
    // Re-read after earlier replay may have remapped the local identity.
    const [current] = await local.adapter.query('SELECT * FROM sync_outbox WHERE id=?', [row.id]);
    if (!current) continue;
    const payload = JSON.parse(current.payload);
    const result = await remote.applySyncItem({
      id: row.id,
      kind: row.kind,
      userId: current.user_id,
      payload,
    });
    if (!result || !['applied', 'conflict', 'deleted'].includes(result.status))
      fail('SYNC_UNACKNOWLEDGED');
    const commands = [];
    if (result.status === 'deleted' && row.kind !== 'delete') {
      commands.push(
        command(
          'INSERT INTO tombstones(user_id,email_hash,deleted_at) VALUES(?,?,?) ON CONFLICT(email_hash) DO NOTHING',
          [current.user_id, hash(payload.email), local.now()],
        ),
      );
      commands.push(command('DELETE FROM users WHERE id=?', [current.user_id]));
      commands.push(command('DELETE FROM sync_outbox WHERE user_id=?', [current.user_id]));
    } else if (result.user) {
      const canonical = result.user;
      // Canonical remote identity wins on email collision. ON UPDATE CASCADE carries events.
      if (canonical.id !== current.user_id) {
        commands.push(command('UPDATE users SET id=? WHERE id=?', [canonical.id, current.user_id]));
        commands.push(
          command('UPDATE sync_outbox SET user_id=? WHERE user_id=?', [
            canonical.id,
            current.user_id,
          ]),
        );
        const queued = await local.adapter.query(
          'SELECT id,payload FROM sync_outbox WHERE user_id=?',
          [current.user_id],
        );
        for (const item of queued)
          commands.push(
            command('UPDATE sync_outbox SET payload=? WHERE id=?', [
              JSON.stringify({ ...JSON.parse(item.payload), userId: canonical.id }),
              item.id,
            ]),
          );
      }
      // Keep newer local edits visible if a replay stops between profile revisions.
      const newerProfile =
        row.kind === 'profile'
          ? await local.adapter.query(
              "SELECT id FROM sync_outbox WHERE user_id=? AND kind='profile' AND sequence>? LIMIT 1",
              [current.user_id, current.sequence],
            )
          : [];
      if (row.kind === 'profile' && (result.status === 'conflict' || newerProfile.length === 0))
        commands.push(
          command(
            'UPDATE users SET display_name=?,goal=?,locale=?,timezone=?,revision=? WHERE id=?',
            [
              canonical.displayName,
              canonical.goal,
              canonical.locale,
              canonical.timezone,
              canonical.revision,
              canonical.id,
            ],
          ),
        );
      // A locally granted role is never imported from remote and vice versa.
    }
    if (result.status === 'conflict') {
      conflicts++;
      commands.push(
        command(
          'INSERT INTO sync_conflicts(id,user_id,reason,created_at) VALUES(?,?,?,?) ON CONFLICT(id) DO NOTHING',
          [
            row.id,
            result.user?.id || current.user_id,
            result.reason || 'Remote revision wins.',
            local.now(),
          ],
        ),
      );
    }
    commands.push(command('DELETE FROM sync_outbox WHERE id=?', [row.id]));
    await local.adapter.batch(commands);
    acknowledged++;
  }
  const [pending] = await local.adapter.query('SELECT COUNT(*) AS count FROM sync_outbox');
  return { acknowledged, conflicts, pending: Number(pending.count) };
}

let singleton;
export async function getStore() {
  if (!singleton) {
    const readiness = getDatabaseReadiness();
    if (!readiness.ready) fail('NOT_CONFIGURED', readiness.reason);
    singleton =
      readiness.mode === 'neon'
        ? createNeonAdapter(process.env.DATABASE_URL).then((adapter) => new LearningStore(adapter))
        : createSqliteAdapter(
            resolve(root, process.env.LOCAL_DATABASE_PATH || '.local-data/learning.sqlite'),
          ).then((adapter) => new LearningStore(adapter));
    singleton.catch(() => {
      singleton = undefined;
    });
  }
  return singleton;
}
