export const DEFAULT_POLICY = Object.freeze({
  id: 'practice-consistency',
  version: 1,
  status: 'shadow',
  enabled: false,
  effectiveFrom: '2026-10-16T00:00:00.000Z',
  owner: 'project-owner',
  pointsPerExercise: 10,
  maxDailyPoints: 30,
  windowDays: 14,
  halfLifeDays: 7,
  rollbackTo: null,
  changelog: 'Initial local shadow policy. No live ranking or learner events.',
});
export function validatePolicy(input) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return { success: false, errors: ['Policy must be an object.'] };
  if (Object.keys(input).some((key) => !Object.hasOwn(DEFAULT_POLICY, key)))
    errors.push('Unknown policy fields are not accepted.');
  if (input.id !== DEFAULT_POLICY.id || !Number.isInteger(input.version) || input.version < 1)
    errors.push('Use the supported rule ID and a positive integer version.');
  if (input.status !== 'shadow' || typeof input.enabled !== 'boolean')
    errors.push('Only shadow mode and a boolean kill switch are supported.');
  if (typeof input.owner !== 'string' || !input.owner.trim() || input.owner.length > 100)
    errors.push('An owner is required.');
  if (typeof input.effectiveFrom !== 'string' || !Number.isFinite(Date.parse(input.effectiveFrom)))
    errors.push('An effective date is required.');
  for (const [key, max] of [
    ['pointsPerExercise', 30],
    ['maxDailyPoints', 100],
    ['windowDays', 30],
    ['halfLifeDays', 30],
  ]) {
    if (!Number.isInteger(input[key]) || input[key] < 1 || input[key] > max)
      errors.push(`${key} must be between 1 and ${max}.`);
  }
  if (
    input.rollbackTo !== null &&
    (!Number.isInteger(input.rollbackTo) ||
      input.rollbackTo < 1 ||
      input.rollbackTo >= input.version)
  )
    errors.push('Rollback must identify an earlier version.');
  if (
    typeof input.changelog !== 'string' ||
    !input.changelog.trim() ||
    input.changelog.length > 1000
  )
    errors.push('A concise changelog is required.');
  return errors.length ? { success: false, errors } : { success: true, data: { ...input } };
}
export function replay(policy, events, now) {
  const validation = validatePolicy(policy);
  if (!validation.success) throw new Error(validation.errors.join(' '));
  const clock = Date.parse(now);
  if (!Number.isFinite(clock)) throw new Error('Replay time must be explicit and valid.');
  if (!Array.isArray(events) || events.length > 1000) throw new Error('Invalid event batch.');
  const fields = ['id', 'exerciseId', 'occurredAt', 'verified'];
  for (const event of events) {
    if (
      !event ||
      typeof event !== 'object' ||
      Object.keys(event).some((key) => !fields.includes(key)) ||
      typeof event.id !== 'string' ||
      !/^[a-z0-9-]{1,100}$/i.test(event.id) ||
      typeof event.exerciseId !== 'string' ||
      !/^[a-z0-9-]{1,100}$/i.test(event.exerciseId) ||
      typeof event.verified !== 'boolean' ||
      typeof event.occurredAt !== 'string' ||
      !Number.isFinite(Date.parse(event.occurredAt))
    )
      throw new Error('Invalid event contract; personal or extra fields are not accepted.');
  }
  if (!policy.enabled || clock < Date.parse(policy.effectiveFrom))
    return {
      simulatedPoints: 0,
      appliedPoints: 0,
      reason: 'Rule disabled or not effective. No points applied.',
      version: policy.version,
    };
  const seen = new Set();
  const ids = new Set();
  const daily = new Map();
  for (const event of [...events].sort(
    (a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id),
  )) {
    const timestamp = Date.parse(event.occurredAt);
    const age = (clock - timestamp) / 86400000;
    const day = new Date(timestamp).toISOString().slice(0, 10);
    const key = `${day}:${event.exerciseId}`;
    if (
      !event.verified ||
      age < 0 ||
      age >= policy.windowDays ||
      seen.has(key) ||
      ids.has(event.id)
    )
      continue;
    seen.add(key);
    ids.add(event.id);
    const dayAge = Math.floor(clock / 86400000) - Math.floor(timestamp / 86400000);
    const previous = daily.get(day) || { points: 0, age: dayAge };
    previous.points = Math.min(policy.maxDailyPoints, previous.points + policy.pointsPerExercise);
    daily.set(day, previous);
  }
  const simulatedPoints =
    Math.round(
      [...daily.values()].reduce(
        (sum, day) => sum + day.points * 2 ** (-day.age / policy.halfLifeDays),
        0,
      ) * 100,
    ) / 100;
  return {
    simulatedPoints,
    appliedPoints: 0,
    version: policy.version,
    reason: `Shadow preview: one verified completion per exercise per day, capped at ${policy.maxDailyPoints}/day, decaying over ${policy.halfLifeDays} days. No live points or ranking changed.`,
  };
}
