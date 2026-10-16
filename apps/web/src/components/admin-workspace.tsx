'use client';
import { useState } from 'react';
import type { Course } from '../../../../packages/course-schema/index.mjs';
import { validateCourse } from '../../../../packages/course-schema/index.mjs';
import { DEFAULT_POLICY, validatePolicy, replay } from '../../../../packages/algorithm/index.mjs';
import { Markdown } from './markdown';
import { Arrow } from './brand';

type Section = 'Overview' | 'Curriculum' | 'Algorithm lab' | 'Feature flags' | 'Integrations';
const sections: Section[] = [
  'Overview',
  'Curriculum',
  'Algorithm lab',
  'Feature flags',
  'Integrations',
];
function download(name: string, content: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
export function AdminWorkspace({
  course,
  lessons,
  source,
}: {
  course: Course;
  lessons: Record<string, string>;
  source: string;
}) {
  const [section, setSection] = useState<Section>('Overview');
  const [selected, setSelected] = useState(course.chapters[0].id);
  const [drafts, setDrafts] = useState(lessons);
  const [title, setTitle] = useState(course.title);
  const [policyText, setPolicyText] = useState(JSON.stringify(DEFAULT_POLICY, null, 2));
  const [status, setStatus] = useState(
    'Draft workspace ready. Changes stay in this tab unless you download them.',
  );
  const [replayResult, setReplayResult] = useState<{
    simulatedPoints: number;
    reason: string;
  } | null>(null);
  const [flags, setFlags] = useState({
    mapPreview: true,
    progressSaving: true,
    leaderboards: false,
    community: false,
  });
  function validateDraft() {
    const validation = validateCourse({ ...course, title });
    const tooLarge = Object.values(drafts).some((content) => content.length > 131072);
    if (!validation.success) setStatus(`Manifest needs attention: ${validation.errors.join(' ')}`);
    else if (tooLarge) setStatus('A lesson exceeds the 128 KB draft limit.');
    else
      setStatus(
        'Draft manifest is valid and lesson sizes are within bounds. This is not editorial, security, or accessibility approval.',
      );
  }
  function previewPolicy() {
    try {
      const candidate: unknown = JSON.parse(policyText);
      const checked = validatePolicy(candidate);
      if (!checked.success) {
        setStatus(checked.errors.join(' '));
        setReplayResult(null);
        return;
      }
      const events = [
        {
          id: 'demo-1',
          exerciseId: 'first-component',
          occurredAt: '2026-10-16T09:00:00.000Z',
          verified: true,
        },
        {
          id: 'demo-2',
          exerciseId: 'first-component',
          occurredAt: '2026-10-16T10:00:00.000Z',
          verified: true,
        },
        {
          id: 'demo-3',
          exerciseId: 'javascript-data',
          occurredAt: '2026-10-16T11:00:00.000Z',
          verified: true,
        },
      ];
      const result = replay(checked.data, events, '2026-10-16T12:00:00.000Z');
      setReplayResult(result);
      setStatus(
        'Replay complete against three synthetic events (including one repeat). No live policy changed.',
      );
    } catch {
      setStatus('Policy must be valid JSON matching the supported shadow-policy schema.');
      setReplayResult(null);
    }
  }
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <p className="eyebrow">iLearnNation / studio</p>
        <h2>
          The control room<span>.</span>
        </h2>
        <span className="preview-badge">Local draft preview</span>
        <nav aria-label="Admin workspace">
          {sections.map((item) => (
            <button
              key={item}
              aria-current={section === item ? 'page' : undefined}
              onClick={() => setSection(item)}
            >
              <span aria-hidden="true">
                {item === 'Overview'
                  ? '◫'
                  : item === 'Curriculum'
                    ? '▤'
                    : item === 'Algorithm lab'
                      ? '⌘'
                      : item === 'Feature flags'
                        ? '⚑'
                        : '↔'}
              </span>
              {item}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-note">
          <span className="status-dot" />
          <strong>No production access</strong>
          <p>No account changes, GitHub writes, live scoring, or publishing are available here.</p>
        </div>
      </aside>
      <main id="main-content" className="admin-main">
        <div className="admin-topline">
          <span>
            Workspace <span aria-hidden="true">/</span> {section}
          </span>
          <span className="demo-label">Drafts, not deployment</span>
        </div>
        <div className="admin-heading">
          <div>
            <p className="eyebrow">A considered learning system</p>
            <h1>{section === 'Overview' ? 'Make the next chapter better.' : section}</h1>
            <p>Review the content. Understand the rules. Keep people in control.</p>
          </div>
          {section === 'Curriculum' && (
            <button className="button" onClick={validateDraft}>
              Validate draft <Arrow />
            </button>
          )}
        </div>
        <div className="admin-banner">
          <span aria-hidden="true">↳</span>
          <p>
            This is a local draft workbench with public course content and synthetic events.
            Production editing requires authentication, server authorization, durable audit storage,
            and review gates.
          </p>
        </div>
        {section === 'Overview' && (
          <>
            <div className="admin-stats">
              <article>
                <span>Course versions</span>
                <strong>
                  01<span> draft</span>
                </strong>
                <p>One focused learning path</p>
              </article>
              <article>
                <span>Authored chapters</span>
                <strong>{String(course.chapters.length).padStart(2, '0')}</strong>
                <p>Original, schema-validated drafts</p>
              </article>
              <article>
                <span>Live learners</span>
                <strong>—</strong>
                <p>No learner data collected</p>
              </article>
              <article>
                <span>Algorithm mode</span>
                <strong className="stat-word">Shadow</strong>
                <p>Kill switch on · no live scoring</p>
              </article>
            </div>
            <section className="admin-panel">
              <div className="panel-heading">
                <h2>Continue the work</h2>
                <span className="small-note">One loop before everything else</span>
              </div>
              <button className="admin-task" onClick={() => setSection('Curriculum')}>
                <span className="task-icon">01</span>
                <span>
                  <strong>Review the first course</strong>
                  <small>
                    Edit a chapter, preview Markdown, validate and download a local draft.
                  </small>
                </span>
                <Arrow />
              </button>
              <button className="admin-task" onClick={() => setSection('Algorithm lab')}>
                <span className="task-icon">02</span>
                <span>
                  <strong>Inspect a rule, not a black box</strong>
                  <small>Replay a capped, decay-aware policy against synthetic inputs.</small>
                </span>
                <Arrow />
              </button>
              <button className="admin-task" onClick={() => setSection('Integrations')}>
                <span className="task-icon">03</span>
                <span>
                  <strong>Resolve source connections</strong>
                  <small>GitHub credentials and Mapbox MCP access need verification.</small>
                </span>
                <Arrow />
              </button>
            </section>
            <section className="admin-panel">
              <h2>Release readiness</h2>
              <ul className="readiness-list">
                <li>
                  <span className="tag">Local</span> Versioned course schema and deterministic
                  content checks
                </li>
                <li>
                  <span className="tag">Local</span> {course.chapters.length} checkpoints and
                  private SQL account progress
                </li>
                <li>
                  <span className="draft-tag">Pending</span> Course licenses, GitHub publication,
                  and pinned remote import
                </li>
                <li>
                  <span className="draft-tag">Pending</span> Identity, authorization, retention, and
                  public-launch review
                </li>
              </ul>
            </section>
          </>
        )}
        {section === 'Curriculum' && (
          <>
            <section className="admin-panel">
              <label className="field-label" htmlFor="course-title">
                Draft course title
              </label>
              <input
                id="course-title"
                value={title}
                maxLength={200}
                onChange={(event) => setTitle(event.target.value)}
              />
              <p className="small-note">
                Source: {source} · v{course.version}. Published versions must never be edited in
                place.
              </p>
              <div className="curriculum-table">
                <table>
                  <caption>Course chapter drafts</caption>
                  <thead>
                    <tr>
                      <th>Chapter</th>
                      <th>Effort</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.chapters.map((chapter, index) => (
                      <tr key={chapter.id}>
                        <th scope="row">
                          <span className="table-number">{String(index + 1).padStart(2, '0')}</span>
                          {chapter.title}
                        </th>
                        <td>{chapter.estimatedMinutes} min</td>
                        <td>
                          <span className="draft-tag">Draft</span>
                        </td>
                        <td>
                          <button
                            className="text-link"
                            onClick={() => setSelected(chapter.id)}
                            aria-label={`Edit ${chapter.title}`}
                          >
                            Edit <Arrow diagonal />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="admin-panel">
              <div className="panel-heading">
                <h2>Chapter editor</h2>
                <select
                  aria-label="Select chapter to edit"
                  value={selected}
                  onChange={(event) => setSelected(event.target.value)}
                >
                  {course.chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-editor-grid">
                <div>
                  <label className="field-label" htmlFor="lesson-draft">
                    Markdown source
                  </label>
                  <textarea
                    id="lesson-draft"
                    className="markdown-editor"
                    value={drafts[selected]}
                    maxLength={131072}
                    onChange={(event) =>
                      setDrafts((current) => ({ ...current, [selected]: event.target.value }))
                    }
                    spellCheck={false}
                  />
                </div>
                <div className="markdown-preview">
                  <p className="eyebrow">Safe preview · scripts and remote images disabled</p>
                  <Markdown
                    source={drafts[selected]}
                    courseId={course.id}
                    chapterIds={course.chapters.map((item) => item.id)}
                  />
                </div>
              </div>
              <div className="progress-actions">
                <button
                  className="button"
                  onClick={() =>
                    download(`${selected}.md`, drafts[selected], 'text/markdown;charset=utf-8')
                  }
                >
                  Download chapter draft <Arrow />
                </button>
                <button
                  className="button secondary"
                  onClick={() => {
                    const checked = validateCourse({ ...course, title });
                    if (!checked.success) {
                      setStatus('Validate and fix the manifest before downloading.');
                      return;
                    }
                    download(
                      'course-draft.json',
                      JSON.stringify({ course: checked.data, lessons: drafts }, null, 2),
                    );
                    setStatus(
                      'Downloaded a local review bundle. No source repository was modified.',
                    );
                  }}
                >
                  Download review bundle
                </button>
                <button
                  className="text-link"
                  onClick={() => {
                    setDrafts((current) => ({ ...current, [selected]: lessons[selected] }));
                    setStatus('This chapter draft was reset to the loaded source.');
                  }}
                >
                  Reset chapter draft
                </button>
              </div>
            </section>
          </>
        )}
        {section === 'Algorithm lab' && (
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Versioned rules, visible reasons.</h2>
              <span className="tag">Shadow only</span>
            </div>
            <p>
              Use <code>enabled: true</code> to preview the rule. <code>enabled: false</code> is the
              kill switch. Previews never award points or change learner privileges.
            </p>
            <div className="admin-editor-grid">
              <div>
                <label className="field-label" htmlFor="policy-json">
                  Policy draft JSON
                </label>
                <textarea
                  id="policy-json"
                  className="policy-editor"
                  value={policyText}
                  maxLength={8192}
                  onChange={(event) => setPolicyText(event.target.value)}
                  spellCheck={false}
                />
                <button className="button" onClick={previewPolicy}>
                  Replay synthetic events <Arrow />
                </button>
              </div>
              <div className="policy-explanation">
                <p className="eyebrow">Replay evidence</p>
                <h3>
                  Three events.
                  <br />
                  One repeat.
                  <br />
                  Zero live decisions.
                </h3>
                <p>
                  The fixture uses two unique exercises and a repeated first exercise on 16 October
                  2026. Repeat attempts do not stack points. No location, identity, or sensitive
                  attributes are accepted.
                </p>
                {replayResult && (
                  <div className="replay-result" role="status">
                    <strong>{replayResult.simulatedPoints}</strong>
                    <span>simulated points · 0 applied</span>
                    <p>{replayResult.reason}</p>
                  </div>
                )}
                <p className="small-note">
                  Before live activation: owner review, version increment, fairness/abuse
                  evaluation, effective date, audit trail, human override, and rollback rehearsal.
                </p>
              </div>
            </div>
          </section>
        )}
        {section === 'Feature flags' && (
          <section className="admin-panel">
            <h2>Experiment locally. Review deliberately.</h2>
            <p>
              These controls preview a proposed configuration in this tab. They do not change the
              learner site or any shared environment.
            </p>
            {Object.entries(flags).map(([key, value]) => (
              <label className="flag-row" key={key}>
                <span>
                  <strong>{key.replace(/([A-Z])/g, ' $1')}</strong>
                  <small>
                    {key === 'leaderboards' || key === 'community'
                      ? 'Deferred until governance and privacy review.'
                      : 'Local experiment only.'}
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(event) =>
                    setFlags((current) => ({ ...current, [key]: event.target.checked }))
                  }
                />
              </label>
            ))}
            <button
              className="button"
              onClick={() =>
                download(
                  'feature-flags-proposal.json',
                  JSON.stringify({ status: 'proposed', flags }, null, 2),
                )
              }
            >
              Download flag proposal <Arrow />
            </button>
          </section>
        )}
        {section === 'Integrations' && (
          <section className="admin-panel">
            <h2>Connections have boundaries.</h2>
            <div className="integration-row">
              <span className="integration-mark">GH</span>
              <div>
                <h3>GitHub course source</h3>
                <p>proffesergio/modern-fullstack-react-projects-building</p>
                <p className="small-note">
                  Read-only website adapter; reviewed commit SHA required. No browser write
                  credentials. Authoring, publication, and import are separate steps.
                </p>
              </div>
              <span className="draft-tag">
                {source.startsWith('GitHub') ? 'Pinned read configured' : 'Local source active'}
              </span>
            </div>
            <div className="integration-row">
              <span className="integration-mark">M</span>
              <div>
                <h3>Mapbox</h3>
                <p>Authorized by owner; connection not yet exposed to this session.</p>
                <p className="small-note">
                  No tokens, map loads, or account changes. Homepage uses opt-in synthetic regions
                  with a list alternative. MCP access and runtime map billing are separate.
                </p>
              </div>
              <span className="draft-tag">Pending connection</span>
            </div>
            <div className="integration-row">
              <span className="integration-mark">↔</span>
              <div>
                <h3>Automation and community</h3>
                <p>n8n, Skool, email, and analytics remain deferred.</p>
                <p className="small-note">
                  A contract and exact-action approval are required before connecting any service.
                </p>
              </div>
              <span className="draft-tag">Not connected</span>
            </div>
          </section>
        )}
        <p role="status" className="admin-status">
          {status}
        </p>
      </main>
    </div>
  );
}
