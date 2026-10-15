import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_POLICY, validatePolicy, replay } from '../packages/algorithm/index.mjs';
const policy = { ...DEFAULT_POLICY, enabled: true };
const now = '2026-10-16T12:00:00.000Z';
const event = {
  id: 'a',
  exerciseId: 'first-component',
  occurredAt: '2026-10-16T10:00:00.000Z',
  verified: true,
};
test('shadow replay is deterministic and never awards real points', () => {
  assert.deepEqual(replay(policy, [event], now), replay(policy, [event], now));
  assert.equal(replay(policy, [event], now).appliedPoints, 0);
  assert.equal(replay(policy, [event], now).simulatedPoints, 10);
});
test('kill switch, caps, duplicate attempts, unverified and future events are safe', () => {
  assert.equal(replay(DEFAULT_POLICY, [event], now).simulatedPoints, 0);
  assert.equal(replay(policy, [event, { ...event, id: 'b' }], now).simulatedPoints, 10);
  assert.equal(replay(policy, [{ ...event, verified: false }], now).simulatedPoints, 0);
  assert.equal(
    replay(policy, [{ ...event, occurredAt: '2027-01-01T00:00:00.000Z' }], now).simulatedPoints,
    0,
  );
  const events = Array.from({ length: 50 }, (_, i) => ({
    ...event,
    id: String(i),
    exerciseId: `exercise-${i}`,
  }));
  assert.equal(replay(policy, events, now).simulatedPoints, 30);
});
test('policy governance and privacy fields cannot be bypassed', () => {
  assert.equal(validatePolicy({ ...policy, maxDailyPoints: 99999 }).success, false);
  assert.equal(validatePolicy({ ...policy, status: 'active' }).success, false);
  assert.equal(validatePolicy({ ...policy, owner: '' }).success, false);
  assert.throws(() => replay(policy, [{ ...event, location: 'private' }], now), /event/i);
  assert.throws(() => replay(policy, [event], 'not-a-date'), /time/i);
});
test('old activity decays and expires', () => {
  const old = { ...event, occurredAt: '2026-10-09T10:00:00.000Z' };
  assert.ok(replay(policy, [old], now).simulatedPoints < 10);
  assert.equal(
    replay(policy, [{ ...old, occurredAt: '2026-09-01T10:00:00.000Z' }], now).simulatedPoints,
    0,
  );
});
test('daily decay is anchored to the UTC day, independent of the first event time', () => {
  const clock = '2026-10-16T10:00:00.000Z';
  const events = Array.from({ length: 3 }, (_, i) => ({
    ...event,
    id: `event-${i}`,
    exerciseId: `exercise-${i}`,
    occurredAt: '2026-10-15T11:00:00.000Z',
  }));
  const earlier = {
    ...event,
    id: 'earlier',
    exerciseId: 'earlier-exercise',
    occurredAt: '2026-10-15T09:00:00.000Z',
  };
  assert.equal(
    replay(policy, events, clock).simulatedPoints,
    replay(policy, [earlier, ...events], clock).simulatedPoints,
  );
});
