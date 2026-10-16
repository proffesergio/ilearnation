export const coursePublication: Record<string, { repository: string; previewChapters: string[] }>;
export function isPreviewChapter(courseId: string, chapterId: string): boolean;
export const legacyChapterIds: Record<string, string>;
