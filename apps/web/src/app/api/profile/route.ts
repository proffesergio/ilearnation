import { currentUser } from '@/lib/auth';
import { getStore, StoreError } from '../../../../../../packages/data/learning-store.mjs';
import {
  assertSameOrigin,
  readJson,
  errorResponse,
} from '../../../../../../packages/auth/security.mjs';
export const runtime = 'nodejs';
export async function GET() {
  try {
    const user = await currentUser({ authoritative: true });
    if (!user) throw new StoreError('UNAUTHORIZED');
    return Response.json({ user }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error);
  }
}
export async function PUT(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await currentUser({ authoritative: true });
    if (!user) throw new StoreError('UNAUTHORIZED');
    const body = await readJson(request);
    if (
      Object.keys(body).some(
        (key) => !['displayName', 'goal', 'locale', 'timezone', 'revision'].includes(key),
      ) ||
      typeof body.displayName !== 'string' ||
      !Number.isSafeInteger(body.revision)
    )
      throw new StoreError('INVALID_INPUT');
    for (const key of ['goal', 'locale', 'timezone'])
      if (body[key] !== undefined && typeof body[key] !== 'string')
        throw new StoreError('INVALID_INPUT');
    const store = await getStore();
    await store.limited(`profile:${user.id}`, 30);
    const saved = await store.saveProfile(
      user.id,
      {
        displayName: body.displayName,
        goal: body.goal as string | undefined,
        locale: body.locale as string | undefined,
        timezone: body.timezone as string | undefined,
      },
      body.revision as number,
    );
    return Response.json({ user: saved }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error);
  }
}
export const PATCH = PUT;
