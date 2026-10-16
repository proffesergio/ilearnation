import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/brand';
import { CoursePlayer } from '@/components/course-player';
import { loadCourse, COURSE_ID } from '@/lib/course';
import { currentUser } from '@/lib/auth';
import { getStore } from '../../../../../../../packages/data/learning-store.mjs';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const { course } = await loadCourse();
  const chapter = course.chapters.find((entry) => entry.id === chapterId);
  return {
    title: chapter?.title || 'Course orientation',
    ...(chapter ? { robots: { index: false, follow: false } } : {}),
  };
}
export default async function Lesson({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;
  if (courseId !== COURSE_ID) notFound();
  const { course, lessons, source } = await loadCourse();
  if (!Object.hasOwn(lessons, chapterId)) notFound();
  const user = await currentUser();
  if (course.chapters.some((chapter) => chapter.id === chapterId)) {
    if (!user) redirect('/signin');
    if (!user.displayName) redirect('/profile');
  }
  const initialProgress = user?.displayName
    ? await (await getStore()).getProgress(user.id, course.id, course.version)
    : null;
  return (
    <>
      <Header />
      <CoursePlayer
        key={`${chapterId}:${user?.id || 'visitor'}`}
        course={course}
        chapterId={chapterId}
        markdown={lessons[chapterId]}
        source={source}
        initialProgress={initialProgress}
        signedIn={Boolean(user)}
      />
    </>
  );
}
