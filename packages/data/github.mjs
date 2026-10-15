const REPOSITORY = 'proffesergio/modern-fullstack-react-projects-building';
export function githubURL(ref, path) {
  if (typeof ref !== 'string' || !/^[a-f0-9]{40}$/i.test(ref))
    throw new Error('A reviewed 40-character Git commit SHA is required.');
  if (
    typeof path !== 'string' ||
    !/^(?:course\.json|getting-started\.md|README\.md|references\.md|chapters\/[a-z0-9-]+\.md)$/.test(
      path,
    )
  )
    throw new Error('Course path is not allowed.');
  return `https://raw.githubusercontent.com/${REPOSITORY}/${ref}/${path}`;
}
export async function fetchText(url, fetcher = fetch) {
  const parsed = new URL(url);
  if (
    parsed.origin !== 'https://raw.githubusercontent.com' ||
    !parsed.pathname.startsWith(`/${REPOSITORY}/`)
  )
    throw new Error('Unapproved course source.');
  const response = await fetcher(url, {
    redirect: 'error',
    signal: AbortSignal.timeout(8000),
    headers: { Accept: 'text/plain' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`GitHub lesson read failed (${response.status}).`);
  if (Number(response.headers.get('content-length')) > 131072)
    throw new Error('Course file too large.');
  if (!response.body) throw new Error('Empty course response.');
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 131072) throw new Error('Course file too large.');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(data);
}
