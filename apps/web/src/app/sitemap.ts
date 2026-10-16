import type { MetadataRoute } from 'next';
import { articles, siteURL } from '@/lib/articles';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/courses',
    '/blog',
    '/courses/full-stack-modern-react-nextjs/getting-started',
    ...articles.map((article) => `/blog/${article.slug}`),
  ].map((path) => ({
    url: new URL(path, siteURL).toString(),
    lastModified: new Date('2026-10-16T00:00:00Z'),
  }));
}
