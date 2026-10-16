import { coursePublication } from '../course-runtime/access.mjs';
const publicPages = new Set([
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
]);
export function isPublicAnalyticsPath(path) {
  return typeof path === 'string' && (publicPages.has(path) || /^\/blog\/[a-z0-9-]+$/.test(path));
}
