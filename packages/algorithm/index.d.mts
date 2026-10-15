export interface Policy {
  id: string;
  version: number;
  status: 'shadow';
  enabled: boolean;
  effectiveFrom: string;
  owner: string;
  pointsPerExercise: number;
  maxDailyPoints: number;
  windowDays: number;
  halfLifeDays: number;
  rollbackTo: number | null;
  changelog: string;
}
export interface LearningEvent {
  id: string;
  exerciseId: string;
  occurredAt: string;
  verified: boolean;
}
export const DEFAULT_POLICY: Readonly<Policy>;
export function validatePolicy(
  input: unknown,
): { success: true; data: Policy } | { success: false; errors: string[] };
export function replay(
  policy: Policy,
  events: LearningEvent[],
  now: string,
): { simulatedPoints: number; appliedPoints: number; reason: string; version: number };
