CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  google_sub TEXT UNIQUE,
  display_name TEXT,
  goal TEXT NOT NULL DEFAULT '',
  locale TEXT NOT NULL DEFAULT 'en',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'admin')),
  revision INTEGER NOT NULL DEFAULT 0,
  created_at BIGINT NOT NULL
);
CREATE TABLE IF NOT EXISTS tombstones (
  user_id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL UNIQUE,
  deleted_at BIGINT NOT NULL
);
CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at BIGINT NOT NULL,
  used_at BIGINT,
  claim_id TEXT,
  revoked_at BIGINT,
  issued_by TEXT NOT NULL,
  created_at BIGINT NOT NULL
);
CREATE TABLE IF NOT EXISTS learning_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  course_id TEXT NOT NULL,
  course_version TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('lesson_read','checkpoint_passed','checkpoint_failed')),
  created_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS events_user_course ON learning_events(user_id, course_id, course_version);
CREATE TABLE IF NOT EXISTS policies (
  id TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  body TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at BIGINT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  created_at BIGINT NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at BIGINT NOT NULL
);
CREATE TABLE IF NOT EXISTS sync_receipts (
  id TEXT PRIMARY KEY,
  result TEXT NOT NULL,
  created_at BIGINT NOT NULL
);
