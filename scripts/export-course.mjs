import { readFile, writeFile, mkdir, cp, readdir } from 'node:fs/promises';
import path from 'node:path';
import { validateCourse } from '../packages/course-schema/index.mjs';
const source = path.resolve('courses/full-stack-modern-react-nextjs');
const manifest = JSON.parse(await readFile(path.join(source, 'course.json'), 'utf8'));
const checked = validateCourse(manifest);
if (!checked.success) throw new Error(checked.errors.join('\n'));
const destination = path.resolve(
  '.course-export/modern-fullstack-react-projects-building',
  manifest.version,
);
await mkdir(destination, { recursive: true });
if ((await readdir(destination)).length)
  throw new Error(
    'Export destination already contains files. Review the existing export; it will not be overwritten.',
  );
for (const name of [
  'course.json',
  'README.md',
  'getting-started.md',
  'references.md',
  'chapters',
  'assets',
]) {
  try {
    await cp(path.join(source, name), path.join(destination, name), {
      recursive: true,
      errorOnExist: true,
      force: false,
      filter: (entry) => !entry.endsWith('.pdf') && !path.basename(entry).startsWith('.'),
    });
  } catch (error) {
    if (name === 'assets' && error.code === 'ENOENT') continue;
    throw error;
  }
}
await writeFile(
  path.join(destination, 'PUBLICATION-STATUS.md'),
  '# Local course export\n\nOriginal draft for owner review. No project license selected; no redistribution permission is granted by this export. No remote was created, no Git history was initialized, and no files were pushed. The publisher must review rights, curriculum, links, and accessibility before publication.\n',
  { flag: 'wx' },
);
console.log(`Local course repository payload ready: ${destination}`);
console.log('Target: https://github.com/proffesergio/modern-fullstack-react-projects-building');
