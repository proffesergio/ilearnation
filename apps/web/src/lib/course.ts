import { cache } from 'react';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateCourse } from '../../../../packages/course-schema/index.mjs';
import { fetchText, githubURL } from '../../../../packages/data/github.mjs';

export const COURSE_ID = 'full-stack-modern-react-nextjs';
export const COURSE_REPO =
  'https://github.com/proffesergio/modern-fullstack-react-projects-building';
export const loadCourse = cache(async () => {
  const remote = process.env.COURSE_SOURCE === 'github';
  const ref = process.env.COURSE_GITHUB_REF || '';
  const root = process.cwd().endsWith(path.join('apps', 'web'))
    ? path.resolve('../..')
    : process.cwd();
  const directory = path.join(root, 'courses', COURSE_ID);
  const read = async (file: string) =>
    remote ? fetchText(githubURL(ref, file)) : readFile(path.join(directory, file), 'utf8');
  const parsed: unknown = JSON.parse(await read('course.json'));
  const validation = validateCourse(parsed);
  if (!validation.success)
    throw new Error(`Course validation failed: ${validation.errors.join('; ')}`);
  const course = validation.data;
  if (course.id !== COURSE_ID) throw new Error('The source returned an unexpected course ID.');
  const lessons: Record<string, string> = {
    'getting-started': await read('getting-started.md'),
    references: await read('references.md'),
  };
  // Limit concurrent remote requests; a pinned commit is the content consistency boundary.
  for (let index = 0; index < course.chapters.length; index += 3) {
    await Promise.all(
      course.chapters.slice(index, index + 3).map(async (chapter) => {
        lessons[chapter.id] = await read(chapter.lessonPath);
      }),
    );
  }
  return {
    course,
    lessons,
    source: remote ? `GitHub · ${ref.slice(0, 7)}` : 'Local course draft',
    remote,
  };
});
