import { currentUser } from '@/lib/auth';
import { getStore, StoreError } from '../../../../../../../packages/data/learning-store.mjs';
import { errorResponse } from '../../../../../../../packages/auth/security.mjs';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const user = await currentUser({ authoritative: true });
    if (!user) throw new StoreError('UNAUTHORIZED');
    const cursor = new URL(request.url).searchParams.get('cursor') || undefined;
    const data = await (await getStore()).exportUser(user.id, { cursor });
    return Response.json(data, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Disposition': 'attachment; filename="ilearnnation-account.json"',
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
