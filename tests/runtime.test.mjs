import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkExercise, STARTER, parseProgress } from '../packages/course-runtime/index.mjs';

test('starter previews its heading without marking the task complete', () => {
  const result = checkExercise(STARTER);
  assert.equal(result.runnable, true);
  assert.equal(result.passed, false);
  assert.equal(result.heading, 'Hello, learner!');
});
test('editing actual JSX changes the output and validation result', () => {
  const result = checkExercise(STARTER.replace('Hello, learner!', 'I learn by building.'));
  assert.equal(result.heading, 'I learn by building.');
  assert.equal(result.passed, true);
});
test('rejects executable expressions, markup, large input and loops without running them', () => {
  for (const source of [
    STARTER.replace('Hello, learner!', '{fetch("https://evil.test")}'),
    STARTER.replace('<h1>', '<h1 onClick={alert(1)}>'),
    STARTER.replace('Hello, learner!', '<script>alert(1)</script>'),
    'while(true){}',
    'x'.repeat(9000),
    null,
  ]) {
    assert.equal(checkExercise(source).runnable, false);
  }
});
test('progress is versioned, bounded, and never imports arbitrary stored fields', () => {
  const valid = {
    schemaVersion: 1,
    courseId: 'full-stack-modern-react-nextjs',
    courseVersion: '0.1.0',
    completed: ['foundations'],
    exercisePassed: true,
  };
  assert.deepEqual(parseProgress(JSON.stringify(valid), ['foundations']), valid);
  assert.equal(parseProgress('{broken', ['foundations']), null);
  assert.equal(
    parseProgress(JSON.stringify({ ...valid, courseVersion: '99.0.0' }), ['foundations']),
    null,
  );
  assert.equal(
    parseProgress(JSON.stringify({ ...valid, completed: ['unknown'] }), ['foundations']),
    null,
  );
  assert.equal(
    parseProgress(JSON.stringify({ ...valid, email: 'private@example.test' }), ['foundations']),
    null,
  );
  const future = { ...valid, courseVersion: '0.2.0' };
  assert.deepEqual(
    parseProgress(JSON.stringify(future), ['foundations'], {
      courseId: valid.courseId,
      courseVersion: '0.2.0',
    }),
    future,
  );
});
test('rejects mismatched return parentheses and automatic semicolon insertion', () => {
  for (const source of [
    'export default function Welcome() { return <h1>I learn by building.</h1>); }',
    'export default function Welcome() { return (<h1>I learn by building.</h1>; }',
    'export default function Welcome() { return\n<h1>I learn by building.</h1>; }',
  ])
    assert.equal(checkExercise(source).runnable, false);
  assert.equal(
    checkExercise(
      'export default function Welcome() { return (\n<h1>I learn by building.</h1>\n); }',
    ).passed,
    true,
  );
});
