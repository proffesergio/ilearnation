import { redirect } from 'next/navigation';
import { Header, Footer } from '@/components/brand';
import { ProfileForm } from '@/components/account-forms';
import { currentUser } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your private profile', robots: { index: false, follow: false } };
export default async function Profile() {
  const user = await currentUser();
  if (!user) redirect('/signin');
  return (
    <>
      <Header />
      <main id="main-content" className="wrap account-page">
        <ProfileForm user={user} />
      </main>
      <Footer />
    </>
  );
}
