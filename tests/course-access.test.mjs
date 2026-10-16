import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  coursePublication,
  isPreviewChapter,
  legacyChapterIds,
} from '../packages/course-runtime/access.mjs';
import { isPublicAnalyticsPath } from '../packages/analytics/policy.mjs';
const course = JSON.parse(
  await readFile(
    new URL('../courses/full-stack-modern-react-nextjs/course.json', import.meta.url),
    'utf8',
  ),
);
test('exactly the first three authored chapters are public preview candidates', () => {
  assert.deepEqual(
    coursePublication[course.id].previewChapters,
    course.chapters.slice(0, 3).map((c) => c.id),
  );
  for (const [index, chapter] of course.chapters.entries())
    assert.equal(isPreviewChapter(course.id, chapter.id), index < 3);
  for (const id of ['missing', '__proto__', 'constructor'])
    assert.equal(isPreviewChapter(id, course.chapters[0].id), false);
  assert.equal(isPreviewChapter(course.id, 'getting-started'), false);
});
test('all legacy chapter links target existing chapters without remapping stored progress', async () => {
  const previous = JSON.parse(
    await readFile(
      new URL(
        '../courses/full-stack-modern-react-nextjs/versions/0.2.0/course.json',
        import.meta.url,
      ),
      'utf8',
    ),
  );
  assert.notEqual(previous.version, course.version);
  for (const chapter of previous.chapters)
    assert.ok(course.chapters.some((c) => c.id === legacyChapterIds[chapter.id]));
});
test('optional analytics allowlist excludes account routes and gated lessons', () => {
  for (const path of [
    '/dashboard',
    '/profile',
    '/admin',
    '/signin',
    '/join',
    '/api/learning',
    '/?email=private@example.test',
    '/blog/a?token=private',
  ])
    assert.equal(isPublicAnalyticsPath(path), false, path);
  for (const [i, c] of course.chapters.entries())
    assert.equal(isPublicAnalyticsPath('/courses/' + course.id + '/' + c.id), i < 3);
  assert.equal(isPublicAnalyticsPath('/courses/' + course.id), true);
});
