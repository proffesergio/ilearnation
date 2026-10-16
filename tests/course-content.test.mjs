import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getActivity } from '../packages/course-runtime/activities.mjs';
const base = new URL('../courses/full-stack-modern-react-nextjs/', import.meta.url);
const course = JSON.parse(await readFile(new URL('course.json', base), 'utf8'));
test('book-ordered edition contains substantive complete learning loops and primary references', async () => {
  assert.equal(course.version, '0.3.0');
  assert.equal(course.chapters.length, 20);
  assert.equal(course.chapters[0].title, 'Preparing for Full-Stack Development');
  assert.equal(course.chapters[19].title, 'Diving Deeper into Full-Stack Development');
  assert.deepEqual(
    course.completion.requiredChapters,
    course.chapters.map((c) => c.id),
  );
  const references = await readFile(new URL('references.md', base), 'utf8');
  for (const chapter of course.chapters) {
    assert.ok(getActivity(chapter.exerciseId), chapter.id);
    const lesson = await readFile(new URL(chapter.lessonPath, base), 'utf8');
    assert.ok(lesson.startsWith('# ' + chapter.title), chapter.id + ': exact title');
    assert.ok(lesson.split(/\s+/).length >= 450, chapter.id + ': substantive lesson');
    assert.ok(lesson.includes('0.3.0'), chapter.id + ': edition');
    for (const section of [
      'Objectives',
      'Prerequisites',
      'Effort',
      'Concept',
      'Step-by-step tutorial',
      'Runnable checkpoint',
      'Exercise',
      'Hints',
      'Validation',
      'Common mistakes',
      'Accessibility',
      'Reflection',
      'References',
    ])
      assert.ok(lesson.includes('## ' + section), chapter.id + ': ' + section);
    assert.ok(
      lesson.includes('<details>') && lesson.includes('Hint 2'),
      chapter.id + ': progressive hints',
    );
    assert.match(lesson, /reset|restore/i, chapter.id + ': recovery');
    assert.match(lesson, /npm (test|run)/, chapter.id + ': executable project checkpoint');
    const sources = course.references.filter((r) => r.chapters.includes(chapter.id));
    assert.ok(sources.length);
    for (const source of sources) {
      assert.ok(references.includes(source.url));
      assert.ok(lesson.includes(source.url));
    }
  }
  assert.match(
    await readFile(new URL(course.chapters.at(-1).lessonPath, base), 'utf8'),
    /## Conclusion/,
  );
});
test('earlier eight- and twenty-chapter versions remain readable snapshots', async () => {
  for (const [version, count] of [
    ['0.1.0', 8],
    ['0.2.0', 20],
  ]) {
    const old = JSON.parse(
      await readFile(new URL('versions/' + version + '/course.json', base), 'utf8'),
    );
    assert.equal(old.version, version);
    assert.equal(old.chapters.length, count);
    for (const chapter of old.chapters)
      assert.ok(
        (await readFile(new URL('versions/' + version + '/' + chapter.lessonPath, base), 'utf8'))
          .length > 500,
      );
  }
});
test('project supplies real framework workspaces with a reproducible install and browser check', async () => {
  const project = new URL('projects/field-notes/', base);
  const pkg = JSON.parse(await readFile(new URL('package.json', project), 'utf8'));
  assert.deepEqual(pkg.workspaces, ['api', 'web', 'ssr', 'next-app']);
  const lock = JSON.parse(await readFile(new URL('package-lock.json', project), 'utf8'));
  assert.ok(lock.lockfileVersion >= 3);
  for (const path of [
    'api/src/app.mjs',
    'api/src/store.mjs',
    'api/src/realtime.mjs',
    'api/test/api.test.mjs',
    'web/src/main.jsx',
    'ssr/src/server.mjs',
    'next-app/app/page.jsx',
    'Dockerfile',
    'compose.yaml',
    'smoke.spec.mjs',
  ])
    assert.ok((await readFile(new URL(path, project), 'utf8')).length > 100);
});
