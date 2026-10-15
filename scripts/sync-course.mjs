import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { validateCourse } from '../packages/course-schema/index.mjs';
import { fetchText, githubURL } from '../packages/data/github.mjs';
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--ref')
  throw new Error('Usage: npm run course:sync -- --ref <reviewed-40-character-commit-SHA>');
const ref = args[1];
const text = await fetchText(githubURL(ref, 'course.json'));
const checked = validateCourse(JSON.parse(text));
if (!checked.success) throw new Error(checked.errors.join('\n'));
if (checked.data.id !== 'full-stack-modern-react-nextjs') throw new Error('Unexpected course ID.');
const files = { 'course.json': text };
for (const name of [
  'README.md',
  'getting-started.md',
  'references.md',
  ...checked.data.chapters.map((chapter) => chapter.lessonPath),
])
  files[name] = await fetchText(githubURL(ref, name));
const final = path.resolve('.local-data/imports', ref);
try {
  await readFile(path.join(final, 'source-lock.json'));
  throw new Error('This immutable import already exists; it will not be overwritten.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const temp = path.resolve('.local-data/imports', `${ref}-${Date.now()}.pending`);
await mkdir(temp, { recursive: true });
for (const [name, content] of Object.entries(files)) {
  const target = path.join(temp, name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, { flag: 'wx' });
}
const checksums = Object.fromEntries(
  Object.entries(files).map(([name, content]) => [
    name,
    createHash('sha256').update(content).digest('hex'),
  ]),
);
await writeFile(
  path.join(temp, 'source-lock.json'),
  JSON.stringify(
    {
      repository: 'proffesergio/modern-fullstack-react-projects-building',
      commit: ref,
      courseVersion: checked.data.version,
      checksums,
    },
    null,
    2,
  ),
  { flag: 'wx' },
);
await rename(temp, final);
console.log(`Verified remote snapshot staged for review: ${final}`);
console.log('No authored course, published version, or external data was changed.');
