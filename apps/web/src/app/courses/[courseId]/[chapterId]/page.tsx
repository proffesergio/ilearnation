import { notFound } from 'next/navigation';
import { Header } from '@/components/brand';
import { CoursePlayer } from '@/components/course-player';
import { loadCourse, COURSE_ID } from '@/lib/course';
export const dynamic = 'force-dynamic';
export default async function Lesson({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;
  if (courseId !== COURSE_ID) notFound();
  const { course, lessons, source } = await loadCourse();
  if (!Object.hasOwn(lessons, chapterId)) notFound();
  return (
    <>
      <Header />
      <CoursePlayer
        course={course}
        chapterId={chapterId}
        markdown={lessons[chapterId]}
        source={source}
      />
    </>
  );
}
