import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { validateCourse } from '../packages/course-schema/index.mjs';

const manifest = JSON.parse(
  await readFile(
    new URL('../courses/full-stack-modern-react-nextjs/course.json', import.meta.url),
    'utf8',
  ),
);
test('the draft manifest is valid without mutating its input', () => {
  const before = structuredClone(manifest);
  const result = validateCourse(manifest);
  assert.equal(result.success, true, JSON.stringify(result));
  assert.deepEqual(manifest, before);
  assert.equal(result.data.version, '0.2.0');
});
for (const [name, change] of [
  [
    'unsupported schema',
    (c) => {
      c.schemaVersion = 2;
    },
  ],
  [
    'missing objectives',
    (c) => {
      delete c.chapters[0].objectives;
    },
  ],
  [
    'duplicate chapter',
    (c) => {
      c.chapters.push(c.chapters[0]);
    },
  ],
  [
    'traversal',
    (c) => {
      c.chapters[0].lessonPath = 'chapters/../../secret.md';
    },
  ],
  [
    'encoded traversal',
    (c) => {
      c.chapters[0].lessonPath = 'chapters/%2e%2e.md';
    },
  ],
  [
    'remote lesson',
    (c) => {
      c.chapters[0].lessonPath = 'https://example.test/lesson.md';
    },
  ],
  [
    'unsafe reference',
    (c) => {
      c.references[0].url = 'javascript:alert(1)';
    },
  ],
  [
    'non-string reference URL',
    (c) => {
      c.references[0].url = ['https://example.test/'];
    },
  ],
  [
    'impossible source date',
    (c) => {
      c.references[0].accessedOn = '2026-02-30';
    },
  ],
  [
    'unknown executable field',
    (c) => {
      c.scripts = ['https://example.test/run.js'];
    },
  ],
  [
    'unknown chapter field',
    (c) => {
      c.chapters[0].script = 'run.js';
    },
  ],
  [
    'oversized text',
    (c) => {
      c.title = 'x'.repeat(301);
    },
  ],
  [
    'oversized chapter list',
    (c) => {
      c.chapters = Array.from({ length: 101 }, () => c.chapters[0]);
    },
  ],
  [
    'empty chapters',
    (c) => {
      c.chapters = [];
    },
  ],
  [
    'nonfinite effort',
    (c) => {
      c.chapters[0].estimatedMinutes = Infinity;
    },
  ],
  [
    'missing completion chapter',
    (c) => {
      c.completion.requiredChapters = ['missing'];
    },
  ],
  [
    'unmapped reference',
    (c) => {
      c.references[0].chapters = ['missing'];
    },
  ],
  [
    'invalid semver',
    (c) => {
      c.version = 'latest';
    },
  ],
  [
    'unknown status',
    (c) => {
      c.status = 'live-ish';
    },
  ],
]) {
  test(`rejects ${name} with useful errors`, () => {
    const candidate = structuredClone(manifest);
    change(candidate);
    const result = validateCourse(candidate);
    assert.equal(result.success, false);
    assert.ok(result.errors.length > 0);
    assert.ok(result.errors.every((error) => typeof error === 'string' && error.length > 0));
  });
}
test('rejects malformed root values without throwing', () => {
  for (const value of [null, undefined, 1, [], 'text', {}, { chapters: null }]) {
    assert.equal(validateCourse(value).success, false);
  }
});
