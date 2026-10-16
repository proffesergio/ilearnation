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
          The learning library · {1 + courseIdeas.length} paths on the board
        </p>
        <h1>Find a path worth exploring.</h1>
        <p className="lead">
          Try three chapters without login, then continue through the complete React and Next.js
          course. Other subjects show the planned library and have no playable lessons yet.
        </p>
        <CourseCatalog course={course} ideas={courseIdeas} source={source} />
        <section className="catalog-roadmap" aria-labelledby="course-roadmap-title">
          <p className="eyebrow">The first course roadmap</p>
          <h2 id="course-roadmap-title">From first setup to a deployed full-stack project.</h2>
          <p>
            Follow all twenty chapters in the reference book’s order. Build with Node.js, MongoDB,
            Express, React, Docker, JWT, server rendering, SEO, tests, GraphQL, Socket.IO, and
            Next.js. Each chapter connects explanations and practice to the original Field Notes
            project.
          </p>
          <p className="small-note">
            The first three chapters are public previews. Sign in and complete your private profile
            to save progress and enter the remaining web chapters. The full course is also browsable
            on GitHub. Bounded checkpoints record practice; the capstone requires separate project
            evidence.
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
