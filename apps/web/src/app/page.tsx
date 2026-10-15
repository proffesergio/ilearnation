import Link from 'next/link';
import { Arrow, Footer, Header } from '@/components/brand';
import { LearningMap } from '@/components/learning-map';
import { CourseCatalog } from '@/components/course-catalog';
import { courseIdeas } from '@/lib/course-ideas';
import { loadCourse } from '@/lib/course';

export default async function Home() {
  const { course, source } = await loadCourse();
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> A little curiosity can go a long way
            </p>
            <h1>
              Learn deeply.
              <br />
              Build <em>confidently.</em>
            </h1>
            <p className="hero-description">
              A learning studio for people who want to make things. Start with a clear path, get
              your hands into code, and take the next step at your own pace.
            </p>
            <div className="hero-actions">
              <Link href={`/courses/${course.id}/getting-started`} className="button">
                Find your first chapter <Arrow />
              </Link>
              <a href="#how-it-works" className="text-link">
                See how it works <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="hero-note">
              <span className="note-lines" aria-hidden="true">
                ↳
              </span>
              <p>
                No perfect background needed.
                <br />
                <strong>Just a place to start.</strong>
              </p>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-orbit" aria-hidden="true" />
            <div className="code-window">
              <div className="window-bar">
                <span />
                <span />
                <span />
                <small>your-next-chapter.tsx</small>
              </div>
              <div className="code-content">
                <span className="code-comment">{'// Make a small change. See what happens.'}</span>
                <pre>
                  <span className="code-purple">export default function</span>{' '}
                  <span className="code-yellow">YourNextStep</span>() {'{'}
                  <br />
                  {'  '}
                  <span className="code-purple">return</span> (<br />
                  {'    '}&lt;<span className="code-green">h1</span>&gt;
                  <br />
                  {'      '}I learn by building.
                  <span className="typing-caret" />
                  <br />
                  {'    '}&lt;/<span className="code-green">h1</span>&gt;
                  <br />
                  {'  '});
                  <br />
                  {'}'}
                </pre>
              </div>
              <div className="code-result">
                <span className="success-icon">✓</span>
                <div>
                  <strong>Small change. Real understanding.</strong>
                  <span>That’s how a learning loop starts.</span>
                </div>
              </div>
            </div>
            <div className="floating-note">
              <span aria-hidden="true">✦</span> Your pace is a good pace.
            </div>
          </div>
        </section>
        <div className="principles wrap">
          <span>Built around doing</span>
          <p>
            <span aria-hidden="true">⌘</span> Read a little
          </p>
          <i aria-hidden="true" />
          <p>
            <span aria-hidden="true">&lt;/&gt;</span> Change real code
          </p>
          <i aria-hidden="true" />
          <p>
            <span aria-hidden="true">↗</span> Understand the feedback
          </p>
          <i aria-hidden="true" />
          <p>
            <span aria-hidden="true">◇</span> Build something yours
          </p>
        </div>
        <section className="course-section wrap" id="courses">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A growing set of ways to learn</p>
              <h2>One course to start. More paths ahead.</h2>
            </div>
            <Link href="/courses" className="text-link">
              Browse the course library <Arrow />
            </Link>
          </div>
          <CourseCatalog course={course} ideas={courseIdeas} source={source} compact />
        </section>
        <section className="how-section wrap" id="how-it-works">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Progress, without the pressure</p>
              <h2>A small loop. A lasting skill.</h2>
            </div>
            <p>
              Understanding comes from trying.
              <br />
              You get space to do both.
            </p>
          </div>
          <div className="steps">
            {[
              {
                n: '01',
                title: 'Get the idea',
                text: 'A focused explanation. A clear objective. Enough context to start.',
              },
              {
                n: '02',
                title: 'Make it yours',
                text: 'Run a checkpoint, change the code, and see what your change does.',
              },
              {
                n: '03',
                title: 'Keep what you learn',
                text: 'Use hints and feedback, reflect, and save progress on your device.',
              },
            ].map((step) => (
              <article key={step.n}>
                <span className="step-number">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="global-section wrap">
          <div className="global-copy">
            <p className="eyebrow">You belong in the process</p>
            <h2>
              Different starting points.
              <br />A shared way forward.
            </h2>
            <p>
              There’s no single place a learner comes from. Our future learning map will celebrate
              broad, consented regions, with privacy at its center.
            </p>
            <ul className="check-list">
              <li>Location sharing stays optional</li>
              <li>Broad regions, never precise locations</li>
              <li>A region list when a map isn’t for you</li>
            </ul>
            <p className="small-note">
              This preview uses synthetic data. No learner activity or location is collected.
            </p>
          </div>
          <LearningMap />
        </section>
        <section className="closing wrap">
          <div>
            <p className="eyebrow">THE FIRST STEP DOESN’T HAVE TO BE BIG</p>
            <h2>Let’s make something click.</h2>
          </div>
          <Link className="button" href={`/courses/${course.id}/getting-started`}>
            Open the getting-started guide <Arrow />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
