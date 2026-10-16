import { currentUser } from '@/lib/auth';
import { loadCourse } from '@/lib/course';
import { getStore, StoreError } from '../../../../../../packages/data/learning-store.mjs';
import {
  assertSameOrigin,
  readJson,
  errorResponse,
} from '../../../../../../packages/auth/security.mjs';
import { checkActivity } from '../../../../../../packages/course-runtime/activity-validator.mjs';

export const runtime = 'nodejs';
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) throw new StoreError('UNAUTHORIZED');
    if (!user.displayName) throw new StoreError('PROFILE_REQUIRED');
    const { course } = await loadCourse();
    const progress = await (await getStore()).getProgress(user.id, course.id, course.version);
    return Response.json({ progress }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error);
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await currentUser();
    if (!user) throw new StoreError('UNAUTHORIZED');
    if (!user.displayName) throw new StoreError('PROFILE_REQUIRED');
    const body = await readJson(request, 12_000);
    const fields = ['courseId', 'courseVersion', 'chapterId', 'kind', 'source', 'attemptId'];
    if (
      Object.keys(body).some((key) => !fields.includes(key)) ||
      !['read', 'checkpoint'].includes(String(body.kind)) ||
      typeof body.attemptId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.attemptId)
    )
      throw new StoreError('INVALID_INPUT');
    const { course } = await loadCourse();
    const chapter = course.chapters.find((item) => item.id === body.chapterId);
    if (
      !chapter?.exerciseId ||
      body.courseId !== course.id ||
      body.courseVersion !== course.version
    )
      throw new StoreError(
        'INVALID_INPUT',
        'This lesson or course version is no longer current. Reload the page.',
      );
    if (
      body.kind === 'checkpoint' &&
      (typeof body.source !== 'string' || body.source.length > 8192)
    )
      throw new StoreError('INVALID_INPUT', 'Use an activity input under 8 KB.');
    const store = await getStore();
    await store.limited(`activity:${user.id}`, 90, 60_000);
    const result =
      body.kind === 'checkpoint' ? checkActivity(chapter.exerciseId, body.source) : null;
    const progress = await store.recordLearningEvent({
      id: body.attemptId,
      userId: user.id,
      courseId: course.id,
      courseVersion: course.version,
      chapterId: chapter.id,
      exerciseId: chapter.exerciseId,
      kind: result ? (result.passed ? 'checkpoint_passed' : 'checkpoint_failed') : 'lesson_read',
    });
    return Response.json({ result, progress }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error);
  }
}
