import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/brand';
import { Markdown } from '@/components/markdown';
import { articles, findArticle, siteURL } from '@/lib/articles';
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const article = findArticle((await params).slug);
  if (!article) notFound();
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      url: `${siteURL}/blog/${article.slug}`,
    },
  };
}
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const article = findArticle((await params).slug);
  if (!article) notFound();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Organization', name: 'iLearnNation' },
    mainEntityOfPage: `${siteURL}/blog/${article.slug}`,
  };
  return (
    <>
      <Header />
      <main id="main-content" className="wrap blog-article">
        <article>
          <Link className="back-link" href="/blog">
            ← All field notes
          </Link>
          <p className="eyebrow">iLearnNation field notes · {article.minutes} min</p>
          <h1>{article.title}</h1>
          <p className="lead">{article.description}</p>
          <p className="small-note">Published {article.date} · Original editorial draft</p>
          <Markdown source={article.body} />
          <aside className="progress-panel">
            <h2>Turn the idea into practice.</h2>
            <p>Sign in and complete your profile to work through the related interactive lesson.</p>
            <Link
              className="button"
              href={`/courses/full-stack-modern-react-nextjs/${article.lesson}`}
            >
              Open the related lesson
            </Link>
          </aside>
        </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      </main>
      <Footer />
    </>
  );
}
