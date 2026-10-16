import type { MetadataRoute } from 'next';
import { articles, siteURL } from '@/lib/articles';
import { coursePublication } from '../../../../packages/course-runtime/access.mjs';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/courses',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/editorial-policy',
    ...Object.entries(coursePublication).flatMap(([id, entry]) => [
      `/courses/${id}`,
      `/courses/${id}/getting-started`,
      `/courses/${id}/references`,
      ...entry.previewChapters.map((chapter) => `/courses/${id}/${chapter}`),
    ]),
    ...articles.map((article) => `/blog/${article.slug}`),
  ].map((path) => ({
    url: new URL(path, siteURL).toString(),
    lastModified: new Date('2026-10-16T00:00:00Z'),
  }));
}
