'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { Course } from '../../../../packages/course-schema/index.mjs';
import type { Progress } from '../../../../packages/data/learning-store.mjs';
import { getActivity } from '../../../../packages/course-runtime/activities.mjs';
import type { ActivityResult } from '../../../../packages/course-runtime/activity-validator.mjs';
import { checkExercise } from '../../../../packages/course-runtime/index.mjs';
import { Markdown } from './markdown';
import { Arrow } from './brand';

export function CoursePlayer({
  course,
  chapterId,
  markdown,
  source,
  initialProgress,
  signedIn,
  repository,
}: {
  course: Course;
  chapterId: string;
  markdown: string;
  source: string;
  initialProgress: Progress | null;
  signedIn: boolean;
  repository: string;
}) {
  const chapter = course.chapters.find((item) => item.id === chapterId);
  const index = course.chapters.findIndex((item) => item.id === chapterId);
  const next = course.chapters[index + 1];
  const activity = chapter?.exerciseId ? getActivity(chapter.exerciseId) : null;
  const [progress, setProgress] = useState<Progress>(
    initialProgress || { readChapters: [], passedChapters: [], storage: 'sqlite', pendingSync: 0 },
  );
  const [sourceText, setSourceText] = useState(activity?.starter || '');
  const [result, setResult] = useState<ActivityResult | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    signedIn
      ? 'Your checkpoint outcomes are saved to your account. Exercise input stays in this tab.'
      : 'Free preview: try this checkpoint without an account. Results stay in this tab.',
  );
  const pendingAttempt = useRef<{ id: string; kind: 'read' | 'checkpoint'; source: string } | null>(
    null,
  );
  const textPreview = activity?.inputType === 'jsx' ? checkExercise(sourceText) : null;

  async function submit(kind: 'checkpoint' | 'read') {
    if (!chapter || busy) return;
    setBusy(true);
    const snapshot = kind === 'checkpoint' ? sourceText : '';
    if (
      !pendingAttempt.current ||
      pendingAttempt.current.kind !== kind ||
      pendingAttempt.current.source !== snapshot
    ) {
      pendingAttempt.current = { id: crypto.randomUUID(), kind, source: snapshot };
    }
    try {
      const response = await fetch(signedIn ? '/api/learning' : '/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          courseVersion: course.version,
          chapterId: chapter.id,
          ...(signedIn ? { kind, attemptId: pendingAttempt.current.id } : {}),
          ...(kind === 'checkpoint' ? { source: sourceText } : {}),
        }),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error || 'Your activity could not be saved. Please try again.');
      if (body.progress) setProgress(body.progress);
      if (body.result) setResult(body.result);
      setMessage(
        !signedIn
          ? body.result.passed
            ? 'Preview checkpoint passed. Sign in to save future progress.'
            : 'Use the feedback and try again. No account needed.'
          : kind === 'read'
            ? 'Lesson marked read and saved. Passing the checkpoint is recorded separately.'
            : body.result.passed
              ? 'Checkpoint passed and saved. You can return to this lesson at any time.'
              : 'Attempt saved. Use the feedback and try another small change.',
      );
      pendingAttempt.current = null;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Saving is unavailable. Your current input is still here.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function refresh() {
    setBusy(true);
    try {
      const response = await fetch(`/api/learning?courseId=${encodeURIComponent(course.id)}`, {
        cache: 'no-store',
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Could not restore progress.');
      setProgress(body.progress);
      setMessage('Your saved account progress is up to date.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="player-layout">
      <aside className="course-sidebar">
        <Link className="back-link" href={signedIn ? '/dashboard' : '/courses'}>
          ← {signedIn ? 'My learning' : 'All courses'}
        </Link>
        <p className="eyebrow">Your learning route</p>
        <h2>{course.title}</h2>
        <p className="small-note">
          v{course.version} · {course.status} curriculum
        </p>
        <div className="progress-track">
          <span
            style={{ width: `${(progress.passedChapters.length / course.chapters.length) * 100}%` }}
          />
        </div>
        <p className="progress-label">
          {progress.passedChapters.length} of {course.chapters.length} checkpoints passed
        </p>
        <nav aria-label="Course chapters">
          <Link
            href={`/courses/${course.id}/getting-started`}
            aria-current={chapterId === 'getting-started' ? 'page' : undefined}
          >
            <span>↳</span>Getting started
          </Link>
          {course.chapters.map((item, i) => (
            <Link
              key={item.id}
              href={`/courses/${course.id}/${item.id}`}
              aria-current={item.id === chapterId ? 'page' : undefined}
            >
              <span>
                {progress.passedChapters.includes(item.id) ? '✓' : String(i + 1).padStart(2, '0')}
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
            Your route will still be here.
          </p>
        </div>
      </aside>
      <main id="main-content" className="lesson-main">
        <div className="lesson-breadcrumb">
          <Link href="/courses">Course library</Link>
          <span>/</span>
          <span>{chapter ? `Lesson ${index + 1}` : 'Before you begin'}</span>
          <span className="source-label">{source}</span>
        </div>
        <div className="lesson-topline">
          <span className="tag">
            {chapter ? `${chapter.estimatedMinutes} min · self-paced` : 'Your first 10 minutes'}
          </span>
          <a className="text-link" href={repository} rel="noopener noreferrer" target="_blank">
            Course on GitHub <Arrow diagonal />
          </a>
        </div>
        <Markdown
          source={markdown}
          courseId={course.id}
          chapterIds={course.chapters.map((item) => item.id)}
        />
        {activity && (
          <section className="exercise" aria-labelledby="exercise-heading">
            <div className="exercise-title">
              <div>
                <p className="eyebrow">Your turn · lesson {index + 1}</p>
                <h2 id="exercise-heading">{activity.title}</h2>
              </div>
              <span className="tag">Interactive checkpoint</span>
            </div>
            <p>{activity.prompt}</p>
            <p className="small-note">
              {activity.inputType === 'jsx'
                ? 'This checkpoint previews a bounded text-only component.'
                : 'This lab runs your JSON configuration through a bounded model with real behavior checks.'}{' '}
              The validator does not execute arbitrary code or store your input.
            </p>
            <div className={textPreview ? 'editor-grid' : 'activity-editor'}>
              <div>
                <label className="editor-label" htmlFor="code-editor">
                  {activity.inputLabel}
                </label>
                <textarea
                  id="code-editor"
                  className="code-editor"
                  value={sourceText}
                  maxLength={8192}
                  onChange={(event) => {
                    setSourceText(event.target.value);
                    setResult(null);
                    pendingAttempt.current = null;
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
              {textPreview && (
                <div className="preview">
                  <span className="editor-label">Live text preview</span>
                  <div className="preview-content">
                    {textPreview.runnable ? (
                      <h3>{textPreview.heading}</h3>
                    ) : (
                      <p>{textPreview.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="exercise-actions">
              <button className="button" disabled={busy} onClick={() => void submit('checkpoint')}>
                {busy ? 'Checking…' : 'Run checkpoint'}
              </button>
              <button
                className="text-link"
                disabled={busy}
                onClick={() => {
                  setSourceText(activity.starter);
                  setResult(null);
                  setHintCount(0);
                  pendingAttempt.current = null;
                }}
              >
                Reset activity
              </button>
              <button
                className="text-link"
                disabled={hintCount === activity.hints.length}
                onClick={() => setHintCount((count) => count + 1)}
              >
                Reveal hint {Math.min(hintCount + 1, activity.hints.length)} /{' '}
                {activity.hints.length}
              </button>
            </div>
            {hintCount > 0 && (
              <ol className="hint-list">
                {activity.hints.slice(0, hintCount).map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ol>
            )}
            <div aria-live="polite" className={result?.passed ? 'feedback success' : 'feedback'}>
              {result && (
                <>
                  <p>
                    <strong>{result.passed ? '✓ Checkpoint passed' : 'One more small step'}</strong>
                    <br />
                    {result.message}
                  </p>
                  <ul className="activity-checks">
                    {result.checks.map((check) => (
                      <li key={check.name}>
                        <strong>
                          {check.passed ? '✓' : '○'} {check.name}
                        </strong>
                        <span>{check.detail}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        )}
        {chapter && signedIn ? (
          <section className="progress-panel" aria-labelledby="progress-heading">
            <h2 id="progress-heading">Keep your place.</h2>
            <p>
              Lesson reads and checkpoint results are separate. Results are checked by the server
              and saved for this course version. Raw activity input is not retained.
            </p>
            <div className="progress-actions">
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => void submit('read')}
              >
                {progress.readChapters.includes(chapter.id)
                  ? 'Lesson marked read'
                  : 'Mark lesson read'}
              </button>
              <button className="text-link" disabled={busy} onClick={() => void refresh()}>
                Refresh saved progress
              </button>
            </div>
            <p role="status" className="small-note">
              {message}
            </p>
          </section>
        ) : (
          <section className="progress-panel">
            <h2>{chapter ? 'Save your learning progress.' : 'A place to start.'}</h2>
            <p>
              The first three chapters, orientation, and references are open to everyone. Preview
              results stay in this tab. Sign in and complete your profile to save progress and enter
              the remaining chapters.
            </p>
            <Link className="button" href={signedIn ? '/dashboard' : '/signin'}>
              {signedIn ? 'Open my learning path' : 'Sign in to start learning'} <Arrow />
            </Link>
          </section>
        )}
        {!signedIn && chapter && (
          <p role="status" className="small-note">
            {message}
          </p>
        )}
        {next && chapter && (
          <Link className="next-lesson" href={`/courses/${course.id}/${next.id}`}>
            <div>
              <span className="eyebrow">Next on your route</span>
              <strong>{next.title}</strong>
            </div>
            <Arrow />
          </Link>
        )}
        {chapter && !next && (
          <Link className="next-lesson" href="/dashboard">
            <strong>Return to my learning dashboard</strong>
            <Arrow />
          </Link>
        )}
      </main>
    </div>
  );
}
