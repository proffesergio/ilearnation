import { Header, Footer } from '@/components/brand';
import { SignInForm } from '@/components/account-forms';
import { getAuthReadiness } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Accept your invitation',
  robots: { index: false, follow: false },
};
export default function Join() {
  return (
    <>
      <Header />
      <main id="main-content" className="wrap account-page">
        <SignInForm readiness={getAuthReadiness()} invitation />
      </main>
      <Footer />
    </>
  );
}
