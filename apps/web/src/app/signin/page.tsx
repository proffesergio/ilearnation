import { redirect } from 'next/navigation';
import { Header, Footer } from '@/components/brand';
import { SignInForm } from '@/components/account-forms';
import { currentUser, getAuthReadiness } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Sign in', robots: { index: false, follow: false } };
export default async function SignIn() {
  const user = await currentUser();
  if (user) redirect(user.displayName ? '/dashboard' : '/profile');
  return (
    <>
      <Header />
      <main id="main-content" className="wrap account-page">
        <SignInForm readiness={getAuthReadiness()} />
      </main>
      <Footer />
    </>
  );
}
