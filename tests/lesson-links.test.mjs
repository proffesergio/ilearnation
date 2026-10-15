import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessonLink } from '../packages/course-runtime/links.mjs';
test('course Markdown links resolve only to known lesson routes and HTTPS references', () => {
  assert.equal(
    lessonLink('chapters/foundations.md', 'course', ['foundations']),
    '/courses/course/foundations',
  );
  assert.equal(
    lessonLink('../getting-started.md', 'course', ['foundations']),
    '/courses/course/getting-started',
  );
  assert.equal(lessonLink('references.md', 'course', []), '/courses/course/references');
  assert.equal(lessonLink('https://react.dev/learn', 'course', []), 'https://react.dev/learn');
  for (const href of [
    'javascript:alert(1)',
    '//tracker.test/a',
    '../../secret.md',
    'missing.md',
    'https://user:password@example.test',
  ])
    assert.equal(lessonLink(href, 'course', ['foundations']), null);
});
