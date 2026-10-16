import { loadCourse } from '@/lib/course';
import {
  isPreviewChapter,
  coursePublication,
} from '../../../../../../packages/course-runtime/access.mjs';
import { checkActivity } from '../../../../../../packages/course-runtime/activity-validator.mjs';
import {
  assertSameOrigin,
  readJson,
  errorResponse,
} from '../../../../../../packages/auth/security.mjs';
import { StoreError } from '../../../../../../packages/data/learning-store.mjs';
export const runtime = 'nodejs';
// Bounded deterministic validation: no account, database, arbitrary code, or saved input.
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJson(request, 12_000);
    if (
      Object.keys(body).some(
        (key) => !['courseId', 'chapterId', 'courseVersion', 'source'].includes(key),
      ) ||
      typeof body.courseId !== 'string' ||
      !Object.hasOwn(coursePublication, body.courseId) ||
      typeof body.chapterId !== 'string' ||
      !isPreviewChapter(body.courseId, body.chapterId) ||
      typeof body.source !== 'string' ||
      body.source.length > 8192
    )
      throw new StoreError('INVALID_INPUT');
    const { course } = await loadCourse(body.courseId);
    const chapter = course.chapters.find((entry) => entry.id === body.chapterId);
    if (!chapter?.exerciseId || body.courseVersion !== course.version)
      throw new StoreError('INVALID_INPUT');
    return Response.json(
      { result: checkActivity(chapter.exerciseId, body.source) },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
