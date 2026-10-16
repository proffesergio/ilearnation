import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getActivity, listActivities } from '../packages/course-runtime/activities.mjs';
import { checkActivity } from '../packages/course-runtime/activity-validator.mjs';

const solutions = JSON.parse(
  await readFile(new URL('./fixtures/activity-solutions.json', import.meta.url), 'utf8'),
);
test('all twenty activities reject their starter and accept a worked scenario', () => {
  const activities = listActivities();
  assert.equal(activities.length, 20);
  assert.equal(new Set(activities.map((a) => a.id)).size, 20);
  assert.deepEqual(Object.keys(solutions).sort(), activities.map((a) => a.id).sort());
  for (const activity of activities) {
    assert.equal(checkActivity(activity.id, activity.starter).passed, false, activity.id);
    const result = checkActivity(activity.id, solutions[activity.id]);
    assert.equal(result.passed, true, `${activity.id}: ${JSON.stringify(result)}`);
    assert.ok(result.checks.length >= 2);
    assert.ok(
      result.checks.every((c) => typeof c.name === 'string' && typeof c.detail === 'string'),
    );
    assert.deepEqual(
      result,
      checkActivity(activity.id, solutions[activity.id]),
      'deterministic replay',
    );
  }
});
test('public metadata is isolated and contains only declared learner fields', () => {
  for (const activity of listActivities()) {
    assert.deepEqual(Object.keys(activity).sort(), [
      'hints',
      'id',
      'inputLabel',
      'inputType',
      'prompt',
      'starter',
      'title',
    ]);
    assert.ok(activity.hints.length >= 2);
    const copy = getActivity(activity.id);
    copy.hints.push('modified');
    copy.starter = 'modified';
    assert.deepEqual(getActivity(activity.id), activity);
  }
  assert.equal(getActivity('missing'), null);
});
test('JSON labs reject malformed, oversized, nested, reserved, wrong-shape, and missing-field submissions', () => {
  for (const activity of listActivities().filter((a) => a.inputType === 'json')) {
    const config = JSON.parse(solutions[activity.id]);
    for (const source of [
      null,
      12,
      {},
      [],
      '',
      '{',
      'null',
      '[]',
      'true',
      '"text"',
      ' '.repeat(8193),
      '{"__proto__":{"polluted":true}}',
      '{"constructor":{}}',
      '{"a":' + '['.repeat(20) + '0' + ']'.repeat(20) + '}',
      JSON.stringify({ ...config, extra: true }),
    ]) {
      assert.equal(
        checkActivity(activity.id, source).passed,
        false,
        `${activity.id}: malformed input`,
      );
    }
    for (const key of Object.keys(config)) {
      const incomplete = { ...config };
      delete incomplete[key];
      assert.equal(
        checkActivity(activity.id, JSON.stringify(incomplete)).passed,
        false,
        `${activity.id}: missing ${key}`,
      );
      assert.equal(
        checkActivity(activity.id, JSON.stringify({ ...config, [key]: null })).passed,
        false,
        `${activity.id}: null ${key}`,
      );
      for (const hostileValue of [
        'x'.repeat(301),
        1e100,
        1.5,
        Array(201).fill('oversized'),
        { safe: { constructor: 'reserved' } },
      ]) {
        assert.equal(
          checkActivity(activity.id, JSON.stringify({ ...config, [key]: hostileValue })).passed,
          false,
          `${activity.id}: bounded ${key}`,
        );
      }
      assert.equal(
        checkActivity(activity.id, JSON.stringify({ ...config, [key]: { constructor: 'attack' } }))
          .passed,
        false,
        `${activity.id}: nested reserved key`,
      );
    }
  }
  assert.equal({}.polluted, undefined);
  assert.equal(checkActivity('unknown', '{}').passed, false);
});
test('every taught configuration setting affects scenario acceptance', () => {
  for (const activity of listActivities().filter((a) => a.inputType === 'json')) {
    const good = JSON.parse(solutions[activity.id]);
    const bad = JSON.parse(activity.starter);
    for (const key of Object.keys(good)) {
      if (JSON.stringify(good[key]) === JSON.stringify(bad[key])) continue;
      const mutated = { ...good, [key]: bad[key] };
      assert.equal(
        checkActivity(activity.id, JSON.stringify(mutated)).passed,
        false,
        `${activity.id}: ineffective ${key}`,
      );
    }
  }
});
test('submissions are data and never execute host code', () => {
  for (const activity of listActivities()) {
    for (const source of [
      'process.exit(1)',
      'while(true){}',
      '<script>alert(1)</script>',
      'import("node:fs")',
      '{"x":"https://example.test"}',
    ]) {
      assert.equal(checkActivity(activity.id, source).passed, false);
    }
  }
});
