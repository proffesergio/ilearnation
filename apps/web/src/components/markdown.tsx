import Image from 'next/image';
import { createContext, useContext, useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { safeDisclosures } from '../../../../packages/course-runtime/disclosures.mjs';
import { lessonLink } from '../../../../packages/course-runtime/links.mjs';

const DisclosureContext = createContext(false);
function SafeDetails({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <details onToggle={(event) => setOpen(event.currentTarget.open)}>
      <DisclosureContext.Provider value={open}>{children}</DisclosureContext.Provider>
    </details>
  );
}
function CourseImage({ src, alt }: { src?: string; alt?: string }) {
  const open = useContext(DisclosureContext);
  const match = src?.match(/^(?:\.\.\/|\.\/)?assets\/(learning-route\.(?:svg|gif))$/);
  if (!match)
    return (
      <span className="image-alternative">
        Illustration: {alt || 'course diagram'} (external images are not loaded)
      </span>
    );
  if (match[1].endsWith('.gif') && !open) return null;
  return (
    <picture>
      {match[1].endsWith('.gif') && (
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet="/api/course-assets/learning-route.svg"
        />
      )}
      <Image
        src={`/api/course-assets/${match[1]}`}
        alt={alt || 'Read, run, edit, check, reflect'}
        width={640}
        height={112}
        unoptimized
        className="course-route-image"
      />
    </picture>
  );
}

export function Markdown({
  source,
  courseId = 'full-stack-modern-react-nextjs',
  chapterIds = [],
}: {
  source: string;
  courseId?: string;
  chapterIds?: string[];
}) {
  return (
    <div className="markdown">
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm, safeDisclosures]}
        components={{
          details: SafeDetails,
          a: ({ href, children }) => {
            const safe = lessonLink(href, courseId, chapterIds);
            if (!safe) return <span>{children}</span>;
            return (
              <a
                href={safe}
                rel="noreferrer noopener"
                target={safe.startsWith('https://') ? '_blank' : undefined}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <CourseImage src={typeof src === 'string' ? src : undefined} alt={alt} />
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
