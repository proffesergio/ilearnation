import Link from 'next/link';
import { Header, Footer, Arrow } from '@/components/brand';
import { articles } from '@/lib/articles';
export const metadata = {
  title: 'Field notes on building full-stack apps',
  description:
    'Original, practical React, Next.js, TypeScript, and accessibility tutorials. Read one useful idea and practice it in the learning studio.',
  alternates: { canonical: '/blog' },
};
export default function Blog() {
  return (
    <>
      <Header />
      <main id="main-content" className="wrap learner-dashboard">
        <p className="eyebrow">The field notes</p>
        <h1>Small ideas. Better building.</h1>
        <p className="lead">
          Clear explanations for the problems you meet while making full-stack apps. Read freely,
          then practice in a lesson.
        </p>
        <div className="blog-grid">
          {articles.map((article) => (
            <article key={article.slug}>
              <p className="eyebrow">React · Next.js · TypeScript</p>
              <h2>
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h2>
              <p>{article.description}</p>
              <p className="small-note">
                {article.minutes} min read · {article.date}
              </p>
              <Link className="text-link" href={`/blog/${article.slug}`}>
                Read field note <Arrow />
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
