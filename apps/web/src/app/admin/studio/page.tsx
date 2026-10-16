import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/brand';
import { AdminWorkspace } from '@/components/admin-workspace';
import { loadCourse } from '@/lib/course';
import { currentUser } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Curriculum draft studio',
  robots: { index: false, follow: false },
};
export default async function Studio() {
  const user = await currentUser({ authoritative: true });
  if (!user) redirect('/signin');
  if (user.role !== 'admin') notFound();
  const { course, lessons, source } = await loadCourse();
  return (
    <>
      <Header />
      <AdminWorkspace course={course} lessons={lessons} source={source} />
    </>
  );
}
