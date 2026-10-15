export const STARTER: string;
export const HINTS: string[];
export interface ExerciseResult {
  runnable: boolean;
  passed: boolean;
  heading: string | null;
  message: string;
}
export interface Progress {
  schemaVersion: 1;
  courseId: string;
  courseVersion: string;
  completed: string[];
  exercisePassed: boolean;
}
export function checkExercise(source: unknown): ExerciseResult;
export function parseProgress(
  raw: unknown,
  chapterIds: string[],
  identity?: { courseId: string; courseVersion: string },
): Progress | null;
