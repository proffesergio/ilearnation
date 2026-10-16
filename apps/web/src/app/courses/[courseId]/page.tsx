import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, Arrow } from '@/components/brand';
import { loadCourse } from '@/lib/course';
import { siteURL } from '@/lib/articles';
import {
  coursePublication,
  isPreviewChapter,
} from '../../../../../../packages/course-runtime/access.mjs';
type Props = { params: Promise<{ courseId: string }> };
export async function generateMetadata({ params }: Props) {
  const { courseId } = await params;
  if (!Object.hasOwn(coursePublication, courseId)) notFound();
  const { course } = await loadCourse(courseId);
  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/courses/${courseId}` },
    openGraph: {
      title: course.title,
      description: course.description,
      url: `/courses/${courseId}`,
      type: 'website',
    },
  };
}
export default async function Course({ params }: Props) {
  const { courseId } = await params;
  if (!Object.hasOwn(coursePublication, courseId)) notFound();
  const { course } = await loadCourse(courseId);
  const repository = coursePublication[courseId].repository;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    inLanguage: 'en',
    url: new URL(`/courses/${course.id}`, siteURL).toString(),
    provider: { '@type': 'Organization', name: 'iLearnNation', sameAs: siteURL },
    educationalLevel: course.level,
    numberOfCredits: undefined,
    hasPart: course.chapters.map((chapter) => ({
      '@type': 'LearningResource',
      name: chapter.title,
      url: new URL(`/courses/${course.id}/${chapter.id}`, siteURL).toString(),
      isAccessibleForFree: true,
    })),
  };
  return (
    <>
      <Header />
      <main id="main-content" className="wrap catalog">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
        <div className="overview-intro">
          <p className="eyebrow">COURSE 01 / FULL-STACK SYSTEMS</p>
          <h1>{course.title}</h1>
          <p className="lead">{course.description}</p>
          <p>
            Follow all 20 chapters in the order of Daniel Bugl’s{' '}
            <cite>Modern Full-Stack React Projects</cite>. Build Field Notes, an original technical
            notebook, across Express, MongoDB, React, GraphQL, Socket.IO, and Next.js. The supplied
            book informs the sequence; these explanations and projects are authored for
            iLearnNation.
          </p>
          <div className="overview-actions">
            <Link className="button" href={`/courses/${course.id}/${course.chapters[0].id}`}>
              Try chapter 1 <Arrow />
            </Link>
            <a className="button secondary" href={repository}>
              Browse this course on GitHub <Arrow diagonal />
            </a>
            <Link className="text-link" href={`/courses/${course.id}/getting-started`}>
              Setup guide
            </Link>
          </div>
        </div>
        <dl className="course-facts">
          <div>
            <dt>Coverage</dt>
            <dd>20 chapters + conclusion</dd>
          </div>
          <div>
            <dt>Access</dt>
            <dd>First 3 chapters without login</dd>
          </div>
          <div>
            <dt>Format</dt>
            <dd>Read · build · check · reflect</dd>
          </div>
        </dl>
        <section className="overview-intro">
          <h2>Before you begin</h2>
          <ul>
            {course.prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Budget 60–120 minutes per chapter, plus project practice. Use Node.js 24 and an editor.
            The default project tests run without paid accounts or database credentials; real
            MongoDB persistence is an optional Docker extension.
          </p>
          <p>
            Sign in and complete a private profile for the remaining web chapters and saved
            progress. The entire authored course and project are browsable in its GitHub repository.
            Checkpoint completion records practice; it does not grant accreditation or establish job
            readiness.
          </p>
          <p className="small-note">
            Version {course.version} · English · self-paced · public review edition. Reviewed source
            links: 16 October 2026.{' '}
            <Link href="/editorial-policy">Editorial and corrections policy</Link>.
          </p>
        </section>
        <h2>Chapter by chapter</h2>
        <ol className="curriculum-list">
          {course.chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link href={`/courses/${course.id}/${chapter.id}`}>
                <strong>{chapter.title}</strong>
                <span>
                  {isPreviewChapter(course.id, chapter.id)
                    ? 'Free preview'
                    : 'Account for web progress'}{' '}
                  · {chapter.estimatedMinutes} min
                </span>
              </Link>
              <p>{chapter.summary}</p>
            </li>
          ))}
        </ol>
        <div className="overview-actions">
          <a className="button secondary" href={`${repository}/tree/main/projects/field-notes`}>
            Open the complete project
          </a>
          <Link className="text-link" href={`/courses/${course.id}/references`}>
            Sources and version notes
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
