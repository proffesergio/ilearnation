export interface ActivityResult {
  passed: boolean;
  message: string;
  checks: Array<{ name: string; passed: boolean; detail: string }>;
  preview?: string;
}
/** Server use only. Parses bounded data; never executes a learner submission. */
export function checkActivity(exerciseId: string, source: unknown): ActivityResult;
