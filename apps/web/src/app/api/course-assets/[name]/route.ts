import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
const allowed = new Map([
  ['learning-route.svg', 'image/svg+xml'],
  ['learning-route.gif', 'image/gif'],
]);
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const type = allowed.get(name);
  if (!type) return new NextResponse(null, { status: 404 });
  const root = process.cwd().endsWith(path.join('apps', 'web'))
    ? path.resolve('../..')
    : process.cwd();
  const data = await readFile(
    path.join(root, 'courses/full-stack-modern-react-nextjs/assets', name),
  );
  return new NextResponse(data, {
    headers: {
      'Content-Type': type,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
