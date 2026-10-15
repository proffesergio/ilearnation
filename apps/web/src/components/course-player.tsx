'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Course } from '../../../../packages/course-schema/index.mjs';
import {
  STARTER,
  HINTS,
  checkExercise,
  parseProgress,
  type Progress,
  type ExerciseResult,
} from '../../../../packages/course-runtime/index.mjs';
import { Markdown } from './markdown';
import { Arrow } from './brand';

export function CoursePlayer({
  course,
  chapterId,
  markdown,
  source,
}: {
  course: Course;
  chapterId: string;
  markdown: string;
  source: string;
}) {
  const storageKey = `ilearnnation.progress.${course.id}.${course.version}`;
  const [progress, setProgress] = useState<Progress>({
    schemaVersion: 1,
    courseId: course.id,
    courseVersion: course.version,
    completed: [],
    exercisePassed: false,
  });
  const [message, setMessage] = useState(
    'Progress stays in this tab until you choose to save on this device.',
  );
  const [code, setCode] = useState(STARTER);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [hints, setHints] = useState(0);
  const [running, setRunning] = useState(false);
  const chapter = course.chapters.find((item) => item.id === chapterId);
  const index = course.chapters.findIndex((item) => item.id === chapterId);
  const next = course.chapters[index + 1];
  const isExercise = chapter?.exerciseId === 'first-component';
  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
      setMessage('Saved on this device only. Use Restore saved progress when you return.');
    } catch {
      setMessage('This browser could not save progress. You can keep learning in this tab.');
    }
  }
  function restore() {
    try {
      const stored = localStorage.getItem(storageKey);
      const parsed = parseProgress(
        stored,
        course.chapters.map((item) => item.id),
        { courseId: course.id, courseVersion: course.version },
      );
      if (parsed) {
        setProgress(parsed);
        setMessage('Restored this course version’s saved progress.');
      } else setMessage('No compatible saved progress was found. Nothing was changed.');
    } catch {
      setMessage('Browser storage is unavailable. Your current session still works.');
    }
  }
  function erase() {
    try {
      localStorage.removeItem(storageKey);
      setProgress({ ...progress, completed: [], exercisePassed: false });
      setMessage('Saved progress for this course was removed from this device.');
    } catch {
      setMessage('Could not remove browser storage. Check your browser’s site-data controls.');
    }
  }
  async function run() {
    setRunning(true);
    try {
      const response = await fetch('/api/exercises/first-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: code }),
      });
      if (!response.ok)
        throw new Error('Unable to validate this attempt right now. Try again shortly.');
      const checked: ExerciseResult = await response.json();
      setResult(checked);
      if (checked.passed) setProgress((current) => ({ ...current, exercisePassed: true }));
    } catch (error) {
      setResult({
        runnable: false,
        passed: false,
        heading: null,
        message: error instanceof Error ? error.message : 'Validation is unavailable.',
      });
    } finally {
      setRunning(false);
    }
  }
  function markRead() {
    if (!chapter) return;
    if (isExercise && !progress.exercisePassed) {
      setMessage('Pass the first component checkpoint before marking this chapter read.');
      return;
    }
    setProgress((current) => ({
      ...current,
      completed: [...new Set([...current.completed, chapter.id])],
    }));
    setMessage(
      'Marked read in this tab. Reading progress is self-reported; it is not a credential. Save if you want to keep it.',
    );
  }
  const preview = checkExercise(code);
  return (
    <div className="player-layout">
      <aside className="course-sidebar">
        <Link className="back-link" href="/courses">
          ← All courses
        </Link>
        <p className="eyebrow">Your learning route</p>
        <h2>
          Modern full-stack
          <br />
          React + Next.js
        </h2>
        <p className="small-note">
          v{course.version} · {course.status} curriculum
        </p>
        <div className="progress-track">
          <span
            style={{ width: `${(progress.completed.length / course.chapters.length) * 100}%` }}
          />
        </div>
        <p className="progress-label">
          {progress.completed.length} of {course.chapters.length} chapters marked read
        </p>
        <nav aria-label="Course chapters">
          <Link
            href={`/courses/${course.id}/getting-started`}
            aria-current={chapterId === 'getting-started' ? 'page' : undefined}
          >
            <span>↳</span> Getting started
          </Link>
          {course.chapters.map((item, i) => (
            <Link
              key={item.id}
              href={`/courses/${course.id}/${item.id}`}
              aria-current={item.id === chapterId ? 'page' : undefined}
            >
              <span>
                {progress.completed.includes(item.id) ? '✓' : String(i + 1).padStart(2, '0')}
              </span>
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="sidebar-tip">
          <span aria-hidden="true">✦</span>
          <p>
            Take the time you need.
            <br />
            The route will still be here.
          </p>
        </div>
      </aside>
      <main id="main-content" className="lesson-main">
        <div className="lesson-breadcrumb">
          <Link href="/courses">Course library</Link>
          <span>/</span>
          <span>{chapter ? `Chapter ${index + 1}` : 'Before you begin'}</span>
          <span className="source-label">{source}</span>
        </div>
        <div className="lesson-topline">
          <span className="tag">
            {chapter ? `${chapter.estimatedMinutes} min · self-paced` : 'Your first 10 minutes'}
          </span>
          <a
            href="https://github.com/proffesergio/modern-fullstack-react-projects-building"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Course on GitHub <Arrow diagonal />
          </a>
        </div>
        <Markdown
          source={markdown}
          courseId={course.id}
          chapterIds={course.chapters.map((item) => item.id)}
        />
        {isExercise && (
          <section className="exercise" aria-labelledby="exercise-heading">
            <div className="exercise-title">
              <div>
                <p className="eyebrow">Your turn · first component</p>
                <h2 id="exercise-heading">Make one small change.</h2>
              </div>
              <span className="tag">Interactive checkpoint</span>
            </div>
            <p>
              Change the heading to a sentence of at least 12 characters that includes{' '}
              <strong>building</strong>. Keep the component’s structure.
            </p>
            <p className="small-note">
              This first checkpoint parses a text-only JSX heading. It does not execute JavaScript,
              imports, expressions, or network requests.
            </p>
            <div className="editor-grid">
              <div>
                <label className="editor-label" htmlFor="code-editor">
                  Welcome.tsx
                </label>
                <textarea
                  id="code-editor"
                  className="code-editor"
                  value={code}
                  maxLength={8192}
                  onChange={(event) => {
                    setCode(event.target.value);
                    setResult(null);
                  }}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  aria-describedby="editor-help"
                />
                <p id="editor-help" className="small-note">
                  Use standard textarea keyboard controls. Tab moves to the next control.
                </p>
              </div>
              <div className="preview">
                <span className="editor-label">Live text preview</span>
                <div className="preview-content">
                  {preview.runnable ? (
                    <h3>{preview.heading}</h3>
                  ) : (
                    <p>
                      Keep a single text-only &lt;h1&gt; inside Welcome() to preview your change.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="exercise-actions">
              <button className="button" onClick={run} disabled={running}>
                {running ? 'Checking…' : 'Run checkpoint'} <Arrow />
              </button>
              <button
                className="button secondary"
                onClick={() => {
                  setCode(STARTER);
                  setResult(null);
                  setHints(0);
                }}
              >
                Reset code
              </button>
              <button
                className="text-link"
                disabled={hints === HINTS.length}
                onClick={() => setHints((value) => value + 1)}
              >
                Reveal hint {Math.min(hints + 1, HINTS.length)} / {HINTS.length}
              </button>
            </div>
            {hints > 0 && (
              <ol className="hint-list">
                {HINTS.slice(0, hints).map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ol>
            )}
            <div aria-live="polite" className={result?.passed ? 'feedback success' : 'feedback'}>
              {result && (
                <p>
                  <strong>
                    {result.passed
                      ? '✓ Checkpoint passed'
                      : result.runnable
                        ? 'One more small step'
                        : 'Check your component'}
                  </strong>
                  <br />
                  {result.message}
                </p>
              )}
            </div>
          </section>
        )}
        <section className="progress-panel" aria-labelledby="progress-heading">
          <h2 id="progress-heading">Keep your place, your way.</h2>
          <p>
            Saving is optional. Only course version, chapter IDs, and checkpoint status are stored
            in this browser. Your progress metadata stays local. Running a checkpoint sends its code
            to this site’s validator for the response; the validator does not store it. No account,
            location, or analytics event is collected.
          </p>
          <div className="progress-actions">
            {chapter && (
              <button className="button secondary" onClick={markRead}>
                Mark chapter read
              </button>
            )}
            <button className="button" onClick={persist}>
              Save on this device
            </button>
            <button className="button secondary" onClick={restore}>
              Restore saved progress
            </button>
            <button className="text-link" onClick={erase}>
              Clear saved progress
            </button>
          </div>
          <p role="status" className="small-note">
            {message}
          </p>
        </section>
        {next && (
          <Link className="next-lesson" href={`/courses/${course.id}/${next.id}`}>
            <div>
              <span className="eyebrow">Next on your route</span>
              <strong>{next.title}</strong>
            </div>
            <Arrow />
          </Link>
        )}
      </main>
    </div>
  );
}
