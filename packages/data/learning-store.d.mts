export type Learner = {
  id: string;
  email: string;
  displayName: string | null;
  goal: string;
  locale: string;
  timezone: string;
  role: 'learner' | 'admin';
  revision: number;
  lastActiveAt?: number | null;
  passedCount?: number;
  readCount?: number;
  attemptCount?: number;
};
export type ProfileInput = {
  displayName: string;
  goal?: string;
  locale?: string;
  timezone?: string;
};
export type LearningEvent = {
  id: string;
  userId: string;
  courseId: string;
  courseVersion: string;
  chapterId: string;
  exerciseId: string;
  kind: 'lesson_read' | 'checkpoint_passed' | 'checkpoint_failed';
};
export type Progress = {
  readChapters: string[];
  passedChapters: string[];
  storage: 'sqlite' | 'neon';
  pendingSync: number;
};
export type PolicyRecord = {
  id: string;
  version: number;
  policy: Record<string, unknown>;
  updatedBy: string;
  updatedAt: number;
};
export type DatabaseAdapter = {
  kind: 'sqlite' | 'neon';
  query(sql: string, values?: unknown[]): Promise<Record<string, any>[]>;
  batch(commands: { sql: string; values?: unknown[] }[]): Promise<Record<string, any>[][]>;
  close?(): void;
  initialize?(): Promise<void>;
};
export class StoreError extends Error {
  code: string;
  constructor(code: string, message?: string);
}
export function getDatabaseReadiness(env?: Record<string, string | undefined>): {
  ready: boolean;
  mode: string;
  reason: string | null;
};
export function createSqliteAdapter(path: string): Promise<DatabaseAdapter>;
export function createNeonAdapter(url: string): Promise<DatabaseAdapter>;
export class LearningStore {
  constructor(adapter: DatabaseAdapter, options?: { now?: () => number; queueSync?: boolean });
  adapter: DatabaseAdapter;
  getUser(id: string, options?: { authoritative?: boolean }): Promise<Learner | null>;
  requireUser(id: string, complete?: boolean): Promise<Learner>;
  requireAdmin(id: string): Promise<Learner>;
  limited(key: string, limit?: number, windowMs?: number): Promise<void>;
  upsertGoogleUser(input: { sub: string; email: string; emailVerified: boolean }): Promise<Learner>;
  saveProfile(id: string, profile: ProfileInput, expectedRevision?: number): Promise<Learner>;
  issueInvitation(
    actorId: string,
    input: { email: string; expiresInHours?: number },
  ): Promise<{ id: string; token: string; expiresAt: number }>;
  issueOperatorInvitation(
    email: string,
    expiresInHours?: number,
    actorId?: string,
  ): Promise<{ id: string; token: string; expiresAt: number }>;
  consumeInvitation(token: string): Promise<Learner>;
  revokeInvitation(actorId: string, id: string): Promise<void>;
  getProgress(userId: string, courseId: string, courseVersion: string): Promise<Progress>;
  recordLearningEvent(event: LearningEvent): Promise<Progress>;
  listLearners(actorId: string): Promise<Learner[]>;
  getRecentActivity(
    actorId: string,
    learnerId: string,
    limit?: number,
  ): Promise<{ user: Learner; events: Record<string, any>[] }>;
  adminSummary(actorId: string): Promise<{
    learners: number;
    events: { kind: string; count: number }[];
    audit: Record<string, any>[];
    storage: 'sqlite' | 'neon';
  }>;
  getPolicy(actorId: string, id?: string): Promise<PolicyRecord | null>;
  listPolicyHistory(actorId: string, limit?: number): Promise<PolicyRecord[]>;
  savePolicy(
    actorId: string,
    policy: Record<string, unknown>,
    expectedVersion?: number,
    id?: string,
  ): Promise<PolicyRecord | null>;
  exportUser(
    userId: string,
    options?: { cursor?: string },
  ): Promise<{
    exportedAt: string;
    user: Learner;
    events: Record<string, any>[];
    pagination: { limit: number; hasMore: boolean; nextCursor: string | null };
  }>;
  deleteUser(userId: string): Promise<void>;
  bootstrapAdmin(email: string): Promise<Learner>;
  applySyncItem(item: SyncItem): Promise<SyncResult>;
  close(): void;
}
export function getStore(): Promise<LearningStore>;
export function syncLocalStore(
  local: LearningStore,
  remote: LearningStore | { applySyncItem(item: SyncItem): Promise<SyncResult> },
  limit?: number,
): Promise<{ acknowledged: number; conflicts: number; pending: number }>;
export type SyncItem = {
  id: string;
  kind: 'user' | 'profile' | 'event' | 'delete';
  userId: string;
  payload: Record<string, any>;
};
export type SyncResult = {
  status: 'applied' | 'conflict' | 'deleted';
  user?: Learner;
  reason?: string;
};
