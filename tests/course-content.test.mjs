import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getActivity, listActivities } from '../packages/course-runtime/activities.mjs';

const base = new URL('../courses/full-stack-modern-react-nextjs/', import.meta.url);
const course = JSON.parse(await readFile(new URL('course.json', base), 'utf8'));
test('twenty lessons retain the original arc and contain complete learning loops', async () => {
  assert.equal(course.version, '0.2.0');
  assert.equal(course.status, 'draft');
  assert.equal(course.chapters.length, 20);
  const originalIds = [
    'foundations',
    'javascript-typescript',
    'react-components',
    'nextjs-routing',
    'data-and-forms',
    'quality-accessibility-security',
    'production-workflows',
    'capstone',
  ];
  assert.ok(originalIds.every((id) => course.chapters.some((chapter) => chapter.id === id)));
  assert.deepEqual(
    course.completion.requiredChapters,
    course.chapters.map((chapter) => chapter.id),
  );
  assert.deepEqual(
    new Set(course.chapters.map((chapter) => chapter.exerciseId)),
    new Set(listActivities().map((activity) => activity.id)),
  );
  const references = await readFile(new URL('references.md', base), 'utf8');
  for (const chapter of course.chapters) {
    const activity = getActivity(chapter.exerciseId);
    assert.ok(activity, `${chapter.id}: mapped interactive activity`);
    const lesson = await readFile(new URL(chapter.lessonPath, base), 'utf8');
    assert.ok(
      lesson.includes(activity.prompt),
      `${chapter.id}: the exercise describes its actual lab`,
    );
    assert.ok(lesson.includes('0.2.0'), `${chapter.id}: current draft identity`);
    for (const section of [
      'Objectives',
      'Prerequisites',
      'Effort',
      'Concept',
      'Runnable checkpoint',
      'Exercise',
      'Hints',
      'Validation',
      'Common mistakes',
      'Accessibility',
      'Reflection',
      'References',
    ]) {
      assert.ok(lesson.includes(`## ${section}`), `${chapter.id}: missing ${section}`);
    }
    assert.ok(
      lesson.includes('<details>') && lesson.includes('Hint 2'),
      `${chapter.id}: progressive hints`,
    );
    assert.ok(lesson.includes('Reset:'), `${chapter.id}: reset instructions`);
    const prose = lesson.replace(/```[^\n]*\n[\s\S]*?\n```/g, '');
    assert.ok(
      !/<script\b|javascript:|<svg\b/i.test(prose),
      `${chapter.id}: no active Markdown content`,
    );
    const matchedRefs = course.references.filter((reference) =>
      reference.chapters.includes(chapter.id),
    );
    assert.ok(matchedRefs.length > 0, `${chapter.id}: sources`);
    for (const reference of matchedRefs) {
      assert.ok(references.includes(reference.url));
      assert.ok(lesson.includes(reference.url), `${chapter.id}: source link`);
    }
  }
});
test('all twenty trusted authored JavaScript checkpoints execute without dependencies', async () => {
  // Only repository-authored fixtures are run here. Never feed submissions to this test.
  for (const chapter of course.chapters) {
    const lesson = await readFile(new URL(chapter.lessonPath, base), 'utf8');
    const examples = [...lesson.matchAll(/```js\n([\s\S]*?)\n```/g)];
    assert.equal(examples.length, 1, `${chapter.id}: one isolated runnable checkpoint`);
    assert.ok(
      examples[0][1].includes("console.log('Checkpoint passed')"),
      `${chapter.id}: feedback`,
    );
    // Module evaluation runs the embedded assertions; a failure rejects this import.
    // These source-controlled examples are trusted just like other test modules.
    await import(`data:text/javascript,${encodeURIComponent(examples[0][1])}#${chapter.id}`);
  }
});
test('the previous eight-lesson draft remains available as a versioned snapshot', async () => {
  const previous = JSON.parse(await readFile(new URL('versions/0.1.0/course.json', base), 'utf8'));
  assert.equal(previous.version, '0.1.0');
  assert.equal(previous.chapters.length, 8);
  for (const chapter of previous.chapters) {
    const lesson = await readFile(new URL(`versions/0.1.0/${chapter.lessonPath}`, base), 'utf8');
    assert.ok(lesson.includes('course version 0.1.0'));
  }
});
test('every chapter defaults to a static route with an optional decorative animation', async () => {
  const svg = await readFile(new URL('assets/learning-route.svg', base), 'utf8');
  const gif = await readFile(new URL('assets/learning-route.gif', base));
  assert.ok(svg.includes('<title') && svg.includes('<desc'));
  assert.ok(!/<script\b|<animate\b|<set\b|<foreignObject\b|\bon\w+=|(?:href|src)=/i.test(svg));
  assert.equal(gif.subarray(0, 6).toString(), 'GIF89a');
  assert.ok(!gif.includes(Buffer.from('NETSCAPE2.0')), 'GIF must have no looping extension');
  assert.ok(gif.length < 100_000, 'optional decoration stays small');
  for (const chapter of course.chapters) {
    const lesson = await readFile(new URL(chapter.lessonPath, base), 'utf8');
    assert.match(lesson, /!\[[^\]]+\]\(\.\.\/assets\/learning-route\.svg\)/);
    assert.match(
      lesson,
      /<details>\s*<summary>Optional route animation \(decorative\)<\/summary>[\s\S]*?!\[[^\]]*\]\(\.\.\/assets\/learning-route\.gif\)[\s\S]*?<\/details>/,
    );
    assert.ok(
      lesson.includes(
        'GitHub cannot apply your operating system’s reduced-motion preference to this GIF',
      ),
    );
    assert.ok(lesson.indexOf('learning-route.svg') < lesson.indexOf('learning-route.gif'));
  }
});
