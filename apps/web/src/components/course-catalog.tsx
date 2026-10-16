import Link from 'next/link';
import type { CourseIdea } from '@/lib/course-ideas';
import { Arrow } from '@/components/brand';

type CourseCatalogProps = {
  course: { id: string; chapters: readonly unknown[] };
  ideas: CourseIdea[];
  source: string;
  compact?: boolean;
};

export function CourseCatalog({ course, ideas, source, compact = false }: CourseCatalogProps) {
  return (
    <div className={compact ? 'course-collection course-collection-compact' : 'course-collection'}>
      <Link className="featured-course" href={`/courses/${course.id}/getting-started`}>
        <div className="course-art" aria-hidden="true">
          <span className="art-caption">FROM FIRST CHANGE TO FULL-STACK CAPSTONE</span>
          <div className="framework-symbol">
            ⚛<span>+</span>
            <strong>
              N<span>↗</span>
            </strong>
          </div>
          <div className="art-route">
            <span>01</span>
            <i />
            <span>04</span>
            <i />
            <span>20</span>
          </div>
          <span className="art-footer">MAKE THE WEB YOUR WORKSHOP.</span>
        </div>
        <div className="course-description">
          <div className="tag-row">
            <span className="tag">React + Next.js</span>
            <span className="draft-tag">Active course draft</span>
          </div>
          <h3>Modern full-stack. Built one step at a time.</h3>
          <p>
            The guided route begins with setup and moves through web foundations, React, Next.js,
            data, quality, and deployment toward a complete application.
          </p>
          <div className="course-meta">
            <span>{course.chapters.length} guided lessons</span>
            <span>Interactive checkpoints</span>
            <span>Self-paced</span>
          </div>
          <p className="catalog-rights-note">
            Practice each concept with a runnable checkpoint, an interactive lab, progressive hints,
            and feedback. Sign in to save your progress and build toward the capstone.
          </p>
          <span className="course-cta">
            Start with the getting-started guide <Arrow />
          </span>
        </div>
      </Link>

      <div className="course-ideas-heading">
        <div>
          <p className="eyebrow">A wider learning library</p>
          <h3>Other paths taking shape</h3>
        </div>
        <p>Catalog mockups based on reference titles, not published courses.</p>
      </div>
      <div className="course-idea-grid">
        {ideas.map((idea, index) => (
          <article className={`course-idea-card course-idea-card-${index + 1}`} key={idea.title}>
            <div className="course-idea-art" aria-hidden="true">
              <span className="idea-index">0{index + 2}</span>
              <span className="idea-glyph">{['λ', '✳', '◌'][index]}</span>
              <span className="idea-route">IDEA / IN DEVELOPMENT</span>
            </div>
            <div className="course-idea-copy">
              <div className="tag-row">
                <span className="tag">{idea.category}</span>
                <span className="draft-tag">Mock idea · 0 lessons</span>
              </div>
              <h4>{idea.title}</h4>
              <p>{idea.description}</p>
              <p className="small-note">
                Reference title: <span>{idea.sourceTitle}</span>. Content and permissions not
                reviewed.
              </p>
            </div>
          </article>
        ))}
      </div>
      <p className="catalog-source-note">
        {source}. Only the React and Next.js path is currently playable; the other tiles are
        planning concepts and have no lessons or start links.
      </p>
    </div>
  );
}
