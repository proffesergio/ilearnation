import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/brand';
import { AdminConsole } from '@/components/admin-console';
import { currentUser } from '@/lib/auth';
import { loadAdminData } from '@/lib/admin-data';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Learning administration',
  robots: { index: false, follow: false },
};
export default async function Admin() {
  const user = await currentUser({ authoritative: true });
  if (!user) redirect('/signin');
  if (user.role !== 'admin') notFound();
  const data = await loadAdminData(user.id);
  return (
    <>
      <Header />
      <main id="main-content" className="wrap learner-dashboard">
        <p className="eyebrow">Owner workspace</p>
        <h1>Learning administration.</h1>
        <p className="lead">Understand progress and review the rules that explain it.</p>
        <p>
          <Link className="text-link" href="/admin/studio">
            Open curriculum draft studio
          </Link>{' '}
          ·{' '}
          <Link className="text-link" href="/dashboard">
            My learning
          </Link>
        </p>
        <AdminConsole initial={data} />
      </main>
    </>
  );
}
