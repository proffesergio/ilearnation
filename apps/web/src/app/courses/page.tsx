import Link from 'next/link';
import { Header, Footer } from '@/components/brand';
import { CourseCatalog } from '@/components/course-catalog';
import { courseIdeas } from '@/lib/course-ideas';
import { loadCourse } from '@/lib/course';
export const metadata = { title: 'Course catalog' };
export default async function Courses() {
  const { course, source } = await loadCourse();
  return (
    <>
      <Header />
      <main id="main-content" className="wrap catalog">
        <p className="eyebrow">
          The learning library · {course.chapters.length + courseIdeas.length} paths on the board
        </p>
        <h1>Find a path worth exploring.</h1>
        <p className="lead">
          Start with a chapter-by-chapter React and Next.js course draft. Other subjects are visible
          as concepts so you can see where the library may grow.
        </p>
        <CourseCatalog course={course} ideas={courseIdeas} source={source} />
        <section className="catalog-roadmap" aria-labelledby="course-roadmap-title">
          <p className="eyebrow">The first course roadmap</p>
          <h2 id="course-roadmap-title">From first setup to a deployed full-stack project.</h2>
          <p>
            The intended course will guide learners through environment setup, web foundations,
            JavaScript and TypeScript, React, Next.js, data and forms, testing, accessibility,
            security, Git and CI, then deployment. Each chapter is planned as a short explanation,
            runnable checkpoint, progressive hints, feedback, and a project step.
          </p>
          <p className="small-note">
            The eight current chapters are an early local draft, not the finished deployment course.
            Book chapter mapping and visual adaptation are being prepared from the rights-cleared
            reference; current official sources are recorded in the research notes.
          </p>
          <ol className="curriculum-list">
            {course.chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link href={`/courses/${course.id}/${chapter.id}`}>
                  <strong>{chapter.title}</strong>
                  <span>{chapter.estimatedMinutes} min</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </>
  );
}
