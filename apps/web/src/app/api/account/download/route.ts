import { currentUser } from '@/lib/auth';
import { getStore, StoreError } from '../../../../../../../packages/data/learning-store.mjs';
import { errorResponse } from '../../../../../../../packages/auth/security.mjs';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const user = await currentUser({ authoritative: true });
    if (!user) throw new StoreError('UNAUTHORIZED');
    const store = await getStore();
    const encoder = new TextEncoder();
    let cancelled = false;
    let started = false;
    let cursor: string | undefined;
    let separator = '';
    const stream = new ReadableStream({
      async pull(controller) {
        try {
          if (cancelled || request.signal.aborted) {
            controller.close();
            return;
          }
          if (!started) {
            controller.enqueue(
              encoder.encode(
                `{"user":${JSON.stringify(user)},"exportedAt":${JSON.stringify(new Date().toISOString())},"events":[`,
              ),
            );
            started = true;
            return;
          }
          const page = await store.exportUser(user.id, { cursor });
          if (page.events.length) {
            controller.enqueue(
              encoder.encode(
                separator + page.events.map((event) => JSON.stringify(event)).join(','),
              ),
            );
            separator = ',';
          }
          const next = page.pagination.nextCursor || undefined;
          if (page.pagination.hasMore && (!next || next === cursor))
            throw new Error('Export cursor did not advance.');
          cursor = next;
          if (!page.pagination.hasMore) {
            controller.enqueue(encoder.encode(']}'));
            controller.close();
          }
        } catch {
          controller.error(new Error('The export could not be completed. Please retry.'));
        }
      },
      cancel() {
        cancelled = true;
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="ilearnation-account.json"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
