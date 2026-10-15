import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { validateCourse } from '../packages/course-schema/index.mjs';
const directory = path.resolve('courses/full-stack-modern-react-nextjs');
const checked = validateCourse(
  JSON.parse(await readFile(path.join(directory, 'course.json'), 'utf8')),
);
if (!checked.success) {
  console.error(checked.errors.join('\n'));
  process.exitCode = 1;
} else {
  for (const chapter of checked.data.chapters) {
    const text = await readFile(path.join(directory, chapter.lessonPath), 'utf8');
    if (text.length > 131072) throw new Error(`Lesson too large: ${chapter.id}`);
    await access(path.join(directory, chapter.lessonPath));
  }
  console.log(
    `PASS: schema 1, course ${checked.data.version}, ${checked.data.chapters.length} chapter files; offline content draft.`,
  );
}
