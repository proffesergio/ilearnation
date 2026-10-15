export function lessonLink(href, courseId, chapterIds) {
  if (typeof href !== 'string' || href.length > 2000) return null;
  if (href.startsWith('#')) return /^#[a-z0-9-]*$/i.test(href) ? href : null;
  if (href.startsWith('https://')) {
    try {
      const url = new URL(href);
      return url.username || url.password ? null : url.href;
    } catch {
      return null;
    }
  }
  const match = href.match(/^(?:\.\/|\.\.\/)?(?:chapters\/)?([a-zA-Z0-9-]+)\.md(#[a-z0-9-]+)?$/i);
  if (!match) return null;
  const id = match[1];
  const hash = match[2] || '';
  if (id === 'README') return '/courses';
  if (['getting-started', 'references', ...chapterIds].includes(id))
    return `/courses/${courseId}/${id}${hash}`;
  return null;
}
