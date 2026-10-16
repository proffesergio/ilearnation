import { currentUser } from '@/lib/auth';
import { getStore, StoreError } from '../../../../../../packages/data/learning-store.mjs';
import {
  assertSameOrigin,
  readJson,
  errorResponse,
} from '../../../../../../packages/auth/security.mjs';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const actor = await currentUser({ authoritative: true });
    if (!actor) throw new StoreError('UNAUTHORIZED');
    const body = await readJson(request);
    if (
      typeof body.email !== 'string' ||
      (body.expiresInHours !== undefined && typeof body.expiresInHours !== 'number')
    )
      throw new StoreError('INVALID_INPUT');
    const invitation = await (
      await getStore()
    ).issueInvitation(actor.id, {
      email: body.email,
      expiresInHours: body.expiresInHours as number | undefined,
    });
    return Response.json(
      { ...invitation, url: `${new URL(process.env.AUTH_URL!).origin}/join#${invitation.token}` },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const actor = await currentUser({ authoritative: true });
    if (!actor) throw new StoreError('UNAUTHORIZED');
    const body = await readJson(request);
    if (typeof body.id !== 'string') throw new StoreError('INVALID_INPUT');
    await (await getStore()).revokeInvitation(actor.id, body.id);
    return Response.json({ revoked: true });
  } catch (error) {
    return errorResponse(error);
  }
}
