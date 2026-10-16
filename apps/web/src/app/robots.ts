import type { MetadataRoute } from 'next';
import { siteURL } from '@/lib/articles';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/dashboard', '/profile', '/signin', '/join'],
    },
    sitemap: new URL('/sitemap.xml', siteURL).toString(),
  };
}
