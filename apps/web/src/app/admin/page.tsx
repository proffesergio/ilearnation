import { notFound } from 'next/navigation';
import { Header } from '@/components/brand';
import { AdminWorkspace } from '@/components/admin-workspace';
import { loadCourse } from '@/lib/course';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Studio admin — local draft preview',
  robots: { index: false, follow: false },
};
export default async function Admin() {
  if (process.env.NODE_ENV !== 'development' && process.env.ADMIN_PREVIEW !== 'true') notFound();
  const { course, lessons, source } = await loadCourse();
  return (
    <>
      <Header />
      <AdminWorkspace course={course} lessons={lessons} source={source} />
    </>
  );
}
