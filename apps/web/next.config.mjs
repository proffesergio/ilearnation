import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const nextConfig = {
  outputFileTracingRoot: root,
  outputFileTracingIncludes: {
    '/*': [
      '../../packages/data/migrations/*.sql',
      '../../courses/full-stack-modern-react-nextjs/*.json',
      '../../courses/full-stack-modern-react-nextjs/*.md',
      '../../courses/full-stack-modern-react-nextjs/chapters/*.md',
      '../../courses/full-stack-modern-react-nextjs/assets/learning-route.svg',
      '../../courses/full-stack-modern-react-nextjs/assets/learning-route.gif',
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=()' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};
export default nextConfig;
