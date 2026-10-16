// Publication policy lives outside the immutable curriculum schema.
export const coursePublication = {
  'full-stack-modern-react-nextjs': {
    repository: 'https://github.com/proffesergio/modern-fullstack-react-projects-building',
    previewChapters: [
      'preparing-full-stack-development',
      'nodejs-and-mongodb',
      'express-mongoose-and-jest',
    ],
  },
};
export function isPreviewChapter(courseId, chapterId) {
  return (
    Object.hasOwn(coursePublication, courseId) &&
    coursePublication[courseId].previewChapters.includes(chapterId)
  );
}
// Redirects preserve inbound links. Progress stays attached to its original version.
export const legacyChapterIds = {
  foundations: 'preparing-full-stack-development',
  'javascript-typescript': 'preparing-full-stack-development',
  'react-components': 'react-and-tanstack-query',
  'node-and-data': 'nodejs-and-mongodb',
  'api-contracts': 'express-mongoose-and-jest',
  'async-data': 'react-and-tanstack-query',
  'data-and-forms': 'jwt-authentication',
  'identity-and-access': 'jwt-authentication',
  'rendering-and-seo': 'search-engine-optimization',
  'quality-accessibility-security': 'playwright-end-to-end-testing',
  'learning-insights': 'mongodb-and-victory-analytics',
  'graphql-api': 'graphql-backend',
  'graphql-client': 'apollo-client-frontend',
  'realtime-server': 'express-socketio-backend',
  'realtime-client': 'realtime-react-frontend',
  'realtime-persistence': 'mongodb-event-persistence',
  'nextjs-routing': 'getting-started-nextjs',
  'caching-performance': 'advanced-nextjs-optimization',
  'production-workflows': 'docker-and-cicd',
  capstone: 'deeper-full-stack-development',
};
