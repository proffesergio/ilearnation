import { test } from 'node:test';
import assert from 'node:assert/strict';
import { githubURL, fetchText } from '../packages/data/github.mjs';
const sha = 'a'.repeat(40);
test('only the selected repository, immutable commit and bounded file paths are accepted', () => {
  assert.equal(
    githubURL(sha, 'course.json'),
    `https://raw.githubusercontent.com/proffesergio/modern-fullstack-react-projects-building/${sha}/course.json`,
  );
  for (const path of [
    '../secret',
    '.env',
    'https://evil.test/x',
    'chapters/../../x',
    'assets/a.svg?x=1',
  ]) {
    assert.throws(() => githubURL(sha, path));
  }
  assert.throws(() => githubURL('main', 'course.json'));
});
test('remote reads reject redirects, oversized content and failed responses', async () => {
  let options;
  const ok = async (_url, init) => {
    options = init;
    return new Response('lesson', { status: 200 });
  };
  assert.equal(await fetchText(githubURL(sha, 'chapters/foundations.md'), ok), 'lesson');
  assert.equal(options.redirect, 'error');
  await assert.rejects(
    () => fetchText(githubURL(sha, 'course.json'), async () => new Response('x'.repeat(140000))),
    /large/i,
  );
  await assert.rejects(
    () => fetchText(githubURL(sha, 'course.json'), async () => new Response('', { status: 404 })),
    /404/,
  );
});
