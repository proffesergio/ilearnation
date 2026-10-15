import { NextRequest, NextResponse } from 'next/server';
import { checkExercise } from '../../../../../../../packages/course-runtime/index.mjs';

const buckets = new Map<string, { count: number; until: number }>();
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  // Next development may normalize nextUrl.hostname to localhost. The request's
  // Host retains the browser-visible origin (e.g. 127.0.0.1).
  const expectedOrigin = `${request.nextUrl.protocol}//${request.headers.get('host')}`;
  if (origin && origin !== expectedOrigin)
    return NextResponse.json({ error: 'Origin not allowed.' }, { status: 403 });
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return NextResponse.json({ error: 'JSON required.' }, { status: 415 });
  // Process-local, global anonymous cap; no IPs or learner identity are retained.
  const now = Date.now();
  const previous = buckets.get('anonymous');
  const bucket = previous && previous.until > now ? previous : { count: 0, until: now + 60000 };
  bucket.count += 1;
  buckets.set('anonymous', bucket);
  if (bucket.count > 120)
    return NextResponse.json(
      { error: 'Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  if (Number(request.headers.get('content-length')) > 10000)
    return NextResponse.json({ error: 'Attempt too large.' }, { status: 413 });
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error('Missing body');
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 10000)
          return NextResponse.json({ error: 'Attempt too large.' }, { status: 413 });
        chunks.push(value);
      }
    } finally {
      await reader.cancel().catch(() => {});
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const data: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (
      !data ||
      typeof data !== 'object' ||
      Array.isArray(data) ||
      Object.keys(data).length !== 1 ||
      !('source' in data) ||
      typeof data.source !== 'string'
    )
      return NextResponse.json({ error: 'Provide only a source string.' }, { status: 400 });
    return NextResponse.json(checkExercise(data.source), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid attempt.' }, { status: 400 });
  }
}
