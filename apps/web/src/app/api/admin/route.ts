import { currentUser } from '@/lib/auth';
import { loadAdminData } from '@/lib/admin-data';
import { getStore, StoreError } from '../../../../../../packages/data/learning-store.mjs';
import {
  assertSameOrigin,
  readJson,
  errorResponse,
} from '../../../../../../packages/auth/security.mjs';
import {
  DEFAULT_POLICY,
  replay,
  validatePolicy,
} from '../../../../../../packages/algorithm/index.mjs';

export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const user = await currentUser({ authoritative: true });
    if (!user) throw new StoreError('UNAUTHORIZED');
    const store = await getStore();
    await store.requireAdmin(user.id);
    const learnerId = new URL(request.url).searchParams.get('learnerId');
    if (!learnerId)
      return Response.json(await loadAdminData(user.id), {
        headers: { 'Cache-Control': 'no-store' },
      });
    if (!/^[a-z0-9-]{1,100}$/i.test(learnerId)) throw new StoreError('INVALID_INPUT');
    const exported = await store.getRecentActivity(user.id, learnerId);
    const savedPolicy = await store.getPolicy(user.id);
    const validation = validatePolicy(savedPolicy?.policy || DEFAULT_POLICY);
    if (!validation.success)
      throw new StoreError('INVALID_INPUT', 'The saved policy is not supported.');
    const events = exported.events.slice(-1000);
    const result = replay(
      validation.data,
      events.map((event) => ({
        id: String(event.id),
        exerciseId: String(event.exercise_id),
        occurredAt: new Date(Number(event.created_at)).toISOString(),
        verified: event.kind === 'checkpoint_passed',
      })),
      new Date().toISOString(),
    );
    return Response.json(
      {
        learner: { id: exported.user.id, displayName: exported.user.displayName },
        events: events.slice(0, 100),
        replay: result,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await currentUser({ authoritative: true });
    if (!user) throw new StoreError('UNAUTHORIZED');
    const body = await readJson(request, 20_000);
    if (
      Object.keys(body).some((key) => !['policy', 'expectedVersion'].includes(key)) ||
      !Number.isSafeInteger(body.expectedVersion) ||
      Number(body.expectedVersion) < 0
    )
      throw new StoreError('INVALID_INPUT');
    const validation = validatePolicy(body.policy);
    if (!validation.success) throw new StoreError('INVALID_INPUT', validation.errors.join(' '));
    const store = await getStore();
    await store.requireAdmin(user.id);
    await store.limited(`policy:${user.id}`, 20, 60_000);
    await store.savePolicy(
      user.id,
      validation.data as unknown as Record<string, unknown>,
      Number(body.expectedVersion),
    );
    return Response.json(await loadAdminData(user.id), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
