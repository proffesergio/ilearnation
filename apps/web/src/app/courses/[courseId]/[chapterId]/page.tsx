import { notFound, redirect, permanentRedirect } from 'next/navigation';
import { Header } from '@/components/brand';
import { CoursePlayer } from '@/components/course-player';
import { loadCourse } from '@/lib/course';
import { currentUser } from '@/lib/auth';
import { siteURL } from '@/lib/articles';
import {
  coursePublication,
  isPreviewChapter,
  legacyChapterIds,
} from '../../../../../../../packages/course-runtime/access.mjs';
import { getStore } from '../../../../../../../packages/data/learning-store.mjs';
export const dynamic = 'force-dynamic';
type Params = { params: Promise<{ courseId: string; chapterId: string }> };
export async function generateMetadata({ params }: Params) {
  const { courseId, chapterId } = await params;
  if (!Object.hasOwn(coursePublication, courseId)) notFound();
  const { course } = await loadCourse(courseId);
  const chapter = course.chapters.find((entry) => entry.id === chapterId);
  return {
    title: chapter?.title || (chapterId === 'references' ? 'Course references' : 'Getting started'),
    description: chapter?.summary || course.description,
    alternates: { canonical: `/courses/${courseId}/${chapterId}` },
    robots: { index: !chapter || isPreviewChapter(courseId, chapterId), follow: true },
  };
}
export default async function Lesson({ params }: Params) {
  const { courseId, chapterId } = await params;
  if (!Object.hasOwn(coursePublication, courseId)) notFound();
  if (courseId === 'full-stack-modern-react-nextjs' && legacyChapterIds[chapterId])
    permanentRedirect(`/courses/${courseId}/${legacyChapterIds[chapterId]}`);
  const { course, lessons, source } = await loadCourse(courseId);
  if (!Object.hasOwn(lessons, chapterId)) notFound();
  const user = await currentUser();
  const chapter = course.chapters.find((entry) => entry.id === chapterId);
  if (chapter && !isPreviewChapter(courseId, chapterId)) {
    if (!user) redirect('/signin');
    if (!user.displayName) redirect('/profile');
  }
  const initialProgress = user?.displayName
    ? await (await getStore()).getProgress(user.id, course.id, course.version)
    : null;
  const structured =
    chapter && isPreviewChapter(courseId, chapterId)
      ? {
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: chapter.title,
          description: chapter.summary,
          inLanguage: 'en',
          isAccessibleForFree: true,
          learningResourceType: 'Tutorial',
          url: new URL(`/courses/${courseId}/${chapterId}`, siteURL).toString(),
          isPartOf: {
            '@type': 'Course',
            name: course.title,
            url: new URL(`/courses/${courseId}`, siteURL).toString(),
          },
        }
      : null;
  return (
    <>
      <Header />
      {structured && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }}
        />
      )}
      <CoursePlayer
        key={`${chapterId}:${user?.id || 'visitor'}`}
        course={course}
        chapterId={chapterId}
        markdown={lessons[chapterId]}
        source={source}
        initialProgress={initialProgress}
        signedIn={Boolean(user?.displayName)}
        repository={coursePublication[courseId].repository}
      />
    </>
  );
}
