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
  'projects',
  'versions',
  '.github',
]) {
  try {
    await cp(path.join(source, name), path.join(destination, name), {
      recursive: true,
      errorOnExist: true,
      force: false,
      filter: (entry) => {
        const name = path.basename(entry);
        return (
          !entry.endsWith('.pdf') &&
          !['node_modules', 'dist', 'test-results', 'playwright-report', 'coverage'].includes(
            name,
          ) &&
          (!name.startsWith('.') ||
            ['.github', '.gitignore', '.dockerignore', '.env.example'].includes(name))
        );
      },
    });
  } catch (error) {
    if (name === 'assets' && error.code === 'ENOENT') continue;
    throw error;
  }
}
await writeFile(
  path.join(destination, 'PUBLICATION-STATUS.md'),
  '# Course publication payload\n\nOriginal public review edition. Source adaptation/publication rights are owner-confirmed; supplied books and private files are excluded. No project reuse license is granted by this export. This command does not modify remote repositories; publication uses a separately reviewed Git commit. Human curriculum review remains ongoing.\n',
  { flag: 'wx' },
);
console.log(`Local course repository payload ready: ${destination}`);
console.log('Target: https://github.com/proffesergio/modern-fullstack-react-projects-building');
