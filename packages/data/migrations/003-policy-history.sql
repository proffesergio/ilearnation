CREATE TABLE IF NOT EXISTS policy_versions (
  policy_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  body TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at BIGINT NOT NULL,
  PRIMARY KEY (policy_id, version)
);
INSERT INTO policy_versions(policy_id,version,body,updated_by,updated_at)
SELECT id,version,body,updated_by,updated_at FROM policies WHERE 1=1
ON CONFLICT(policy_id,version) DO NOTHING;
