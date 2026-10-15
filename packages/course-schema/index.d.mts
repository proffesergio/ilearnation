export interface Chapter {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  objectives: string[];
  prerequisites: string[];
  lessonPath: string;
  exerciseId?: string;
}
export interface CourseReference {
  title: string;
  author: string;
  url: string;
  status: string;
  accessedOn: string;
  chapters: string[];
}
export interface Course {
  schemaVersion: 1;
  id: string;
  version: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  title: string;
  description: string;
  locale: string;
  level: string;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  accessibilityNotes: string[];
  chapters: Chapter[];
  completion: { requiredChapters: string[]; capstone: string; rule: string };
  references: CourseReference[];
}
export function validateCourse(
  input: unknown,
): { success: true; data: Course } | { success: false; errors: string[] };
