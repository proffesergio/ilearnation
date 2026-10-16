import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Header, Footer, Arrow } from '@/components/brand';
import { SignOutButton } from '@/components/account-forms';
import { currentUser } from '@/lib/auth';
import { loadCourse } from '@/lib/course';
import { getStore } from '../../../../../packages/data/learning-store.mjs';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your learning studio', robots: { index: false, follow: false } };
export default async function Dashboard() {
  const user = await currentUser();
  if (!user) redirect('/signin');
  if (!user.displayName) redirect('/profile');
  const { course } = await loadCourse();
  const progress = await (await getStore()).getProgress(user.id, course.id, course.version);
  const passed = new Set(progress.passedChapters);
  const next =
    course.chapters.find((chapter) => !passed.has(chapter.id)) || course.chapters.at(-1)!;
  return (
    <>
      <Header />
      <main id="main-content" className="wrap learner-dashboard">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your learning studio</p>
            <h1>Welcome back, {user.displayName}.</h1>
            <p className="lead">A clear path, one useful checkpoint at a time.</p>
          </div>
          <div className="dashboard-actions">
            <Link className="text-link" href="/profile">
              Edit profile
            </Link>
            {user.role === 'admin' && (
              <Link className="text-link" href="/admin">
                Admin console
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>
        <section className="learning-summary" aria-labelledby="progress-title">
          <div>
            <p className="eyebrow">Modern full-stack React and Next.js</p>
            <h2 id="progress-title">
              {passed.size} of {course.chapters.length} checkpoints passed
            </h2>
            <p>
              {progress.readChapters.length} lessons marked read · course v{course.version}
            </p>
            <p className="small-note">
              {progress.storage === 'sqlite'
                ? 'Progress is saved on this installation. Local changes can be synced by the owner.'
                : 'Progress is saved to your account.'}{' '}
              Checkpoint outcomes record these activities; they do not award a credential.
            </p>
          </div>
          <Link className="button" href={`/courses/${course.id}/${next.id}`}>
            {passed.size === course.chapters.length ? 'Revisit your capstone' : 'Continue learning'}
            <Arrow />
          </Link>
        </section>
        <ol className="dashboard-lessons">
          {course.chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <Link href={`/courses/${course.id}/${chapter.id}`}>
                <span className="lesson-number">
                  {passed.has(chapter.id) ? '✓' : String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2>{chapter.title}</h2>
                  <p>{chapter.summary}</p>
                  <span className="small-note">
                    {chapter.estimatedMinutes} min ·{' '}
                    {passed.has(chapter.id) ? 'Checkpoint passed' : 'Ready to learn'}
                  </span>
                </div>
                <Arrow />
              </Link>
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </>
  );
}
