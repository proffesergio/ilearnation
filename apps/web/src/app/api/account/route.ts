import { currentUser } from '@/lib/auth';
import { getStore, StoreError } from '../../../../../../packages/data/learning-store.mjs';
import {
  assertSameOrigin,
  readJson,
  errorResponse,
} from '../../../../../../packages/auth/security.mjs';
export const runtime = 'nodejs';
export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await currentUser({ authoritative: true });
    if (!user) throw new StoreError('UNAUTHORIZED');
    const body = await readJson(request);
    if (body.confirmation !== 'DELETE')
      throw new StoreError('INVALID_INPUT', 'Type DELETE to confirm.');
    await (await getStore()).deleteUser(user.id);
    return Response.json({ deleted: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error);
  }
}
