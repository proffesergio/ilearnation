'use client';
import { useState } from 'react';
import type { AdminData } from '@/lib/admin-data';
import { DEFAULT_POLICY } from '../../../../packages/algorithm/index.mjs';

type ActivityDetail = {
  learner: { id: string; displayName: string | null };
  events: { id: string; chapter_id: string; kind: string; created_at: number }[];
  replay: { simulatedPoints: number; appliedPoints: number; reason: string; version: number };
};
const nextDraft = (data: AdminData) =>
  JSON.stringify(
    { ...(data.policy?.policy || DEFAULT_POLICY), version: (data.policy?.version || 0) + 1 },
    null,
    2,
  );
const dateLabel = (timestamp: number) =>
  new Date(timestamp).toLocaleString('en', { timeZone: 'UTC' });

export function AdminConsole({ initial }: { initial: AdminData }) {
  const [data, setData] = useState(initial);
  const [draft, setDraft] = useState(nextDraft(initial));
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [invite, setInvite] = useState<{ id: string; url: string; expiresAt: number } | null>(null);
  const [detail, setDetail] = useState<ActivityDetail | null>(null);

  async function showActivity(id: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin?learnerId=${encodeURIComponent(id)}`, {
        cache: 'no-store',
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Activity is unavailable.');
      setDetail(body);
      setMessage('Showing saved learning events and a shadow replay for this learner.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  async function savePolicy(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const policy: unknown = JSON.parse(draft);
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy, expectedVersion: data.policy?.version || 0 }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'The policy could not be saved.');
      setData(body);
      setDraft(nextDraft(body));
      setMessage(
        `Policy version ${body.policy.version} saved with an audit record. It remains in shadow mode; no live points are applied.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  async function createInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, expiresInHours: 24 }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'The invitation could not be created.');
      setInvite(body);
      setMessage(
        'Private invitation created. Copy the link to share it yourself. It expires in 24 hours.',
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  async function revokeInvitation() {
    if (!invite) return;
    setBusy(true);
    try {
      const response = await fetch('/api/invitations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: invite.id }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'The invitation could not be revoked.');
      setInvite(null);
      setMessage('Invitation revoked.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-console">
      <div className="admin-metrics">
        <article>
          <span>Accounts</span>
          <strong>{data.summary.learners}</strong>
        </article>
        {data.summary.events.map((event) => (
          <article key={event.kind}>
            <span>{event.kind.replaceAll('_', ' ')}</span>
            <strong>{event.count}</strong>
          </article>
        ))}
      </div>
      <p className="notice">
        Learning events are limited to lesson reads and checkpoint outcomes. Policies run in shadow
        mode. Raw submissions and keystrokes are not retained.
      </p>
      <p role="status" className="form-status">
        {message}
      </p>
      <section aria-labelledby="learner-table-title">
        <h2 id="learner-table-title">Learner activity</h2>
        <p className="small-note">
          Most recent 100 accounts. Times are UTC; counts include all recorded course versions.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Learner</th>
                <th scope="col">Last active</th>
                <th scope="col">Passed</th>
                <th scope="col">Attempts</th>
                <th scope="col">Activity</th>
              </tr>
            </thead>
            <tbody>
              {data.learners.map((learner) => (
                <tr key={learner.id}>
                  <th scope="row">
                    {learner.displayName || 'Profile not completed'}
                    <span className="table-secondary">{learner.email}</span>
                  </th>
                  <td>
                    {learner.lastActiveAt ? dateLabel(learner.lastActiveAt) : 'No learning events'}
                  </td>
                  <td>{learner.passedCount}</td>
                  <td>{learner.attemptCount}</td>
                  <td>
                    <button
                      className="text-link"
                      disabled={busy}
                      onClick={() => void showActivity(learner.id)}
                    >
                      View activity<span className="sr-only"> for {learner.email}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {detail && (
        <section className="admin-detail" aria-labelledby="learner-detail-title">
          <h2 id="learner-detail-title">Activity: {detail.learner.displayName || 'New learner'}</h2>
          <p>
            <strong>
              {detail.replay.simulatedPoints} simulated points · {detail.replay.appliedPoints}{' '}
              applied
            </strong>
          </p>
          <p>{detail.replay.reason}</p>
          <p className="small-note">
            Latest saved events, up to 100 displayed; replay considers the retrieved batch, up to
            1,000.
          </p>
          <ul>
            {detail.events.map((event) => (
              <li key={event.id}>
                {event.chapter_id} · {event.kind.replaceAll('_', ' ')} ·{' '}
                {dateLabel(Number(event.created_at))}
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="admin-columns">
        <section className="account-card">
          <h2>Invite a learner</h2>
          <p>Google sign-up stays open. Invitations provide an alternative private entry link.</p>
          <form onSubmit={createInvitation}>
            <label htmlFor="invite-email">Learner email</label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={254}
            />
            <button className="button" disabled={busy}>
              Create invitation
            </button>
          </form>
          {invite && (
            <div>
              <label htmlFor="invite-url">Private one-use invitation link</label>
              <input
                id="invite-url"
                value={invite.url}
                readOnly
                onFocus={(event) => event.target.select()}
              />
              <p className="small-note">
                Expires {dateLabel(invite.expiresAt)} UTC. Share privately.
              </p>
              <button className="text-link" disabled={busy} onClick={() => void revokeInvitation()}>
                Revoke this invitation
              </button>
            </div>
          )}
        </section>
        <section className="account-card">
          <h2>Algorithm control</h2>
          <p>
            Save a new, validated rule version. Use enabled=false as the disable switch. Replay
            never awards live points.
          </p>
          <form onSubmit={savePolicy}>
            <label htmlFor="algorithm-policy">Algorithm policy JSON</label>
            <textarea
              id="algorithm-policy"
              className="code-editor policy-editor"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={16384}
              spellCheck={false}
            />
            <button className="button" disabled={busy}>
              Save shadow policy
            </button>
          </form>
          <h3>Saved policy history</h3>
          <ul>
            {data.history.map((entry) => (
              <li key={entry.version}>
                v{entry.version} · {dateLabel(entry.updatedAt)}{' '}
                <button
                  className="text-link"
                  onClick={() => {
                    setDraft(
                      JSON.stringify(
                        {
                          ...entry.policy,
                          version: (data.policy?.version || 0) + 1,
                          rollbackTo: entry.version,
                          changelog: `Restore configuration from version ${entry.version}.`,
                        },
                        null,
                        2,
                      ),
                    );
                    setMessage(
                      'Historical configuration loaded as a new version. Review it before saving.',
                    );
                  }}
                >
                  Restore v{entry.version} for review
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section>
        <h2>Admin audit history</h2>
        <ul className="audit-list">
          {data.summary.audit.map((entry) => (
            <li key={String(entry.id)}>
              {String(entry.action).replaceAll('_', ' ')} · {dateLabel(Number(entry.created_at))}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
