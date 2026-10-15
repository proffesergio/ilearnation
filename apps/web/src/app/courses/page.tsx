import Link from 'next/link';
import { Header, Footer, Arrow } from '@/components/brand';
import { loadCourse } from '@/lib/course';
export const metadata = { title: 'Course catalog' };
export default async function Courses() {
  const { course, source } = await loadCourse();
  return (
    <>
      <Header />
      <main id="main-content" className="wrap catalog">
        <p className="eyebrow">The learning library</p>
        <h1>One good place to start.</h1>
        <p className="lead">A focused first course. More depth, one chapter at a time.</p>
        <div className="catalog-card">
          <div className="tag-row">
            <span className="tag">React + Next.js</span>
            <span className="draft-tag">Version {course.version} · draft</span>
          </div>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p className="small-note">
            {source} · {course.chapters.length} chapters · English draft
          </p>
          <Link className="button" href={`/courses/${course.id}/getting-started`}>
            Read getting started <Arrow />
          </Link>
          <ol className="curriculum-list">
            {course.chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link href={`/courses/${course.id}/${chapter.id}`}>
                  <strong>{chapter.title}</strong>
                  <span>
                    {chapter.estimatedMinutes} min <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  );
}
