'use client';

import { useState, useSyncExternalStore } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Learner } from '../../../../packages/data/learning-store.mjs';

const subscribeHash = (notify: () => void) => {
  window.addEventListener('hashchange', notify);
  return () => window.removeEventListener('hashchange', notify);
};
const getHash = () => window.location.hash.slice(1);
const emptyHash = () => '';

export function SignInForm({
  readiness,
  invitation = false,
}: {
  readiness: { configured: boolean; google: boolean; invitations: boolean; message: string };
  invitation?: boolean;
}) {
  const router = useRouter();
  const fragment = useSyncExternalStore(subscribeHash, getHash, emptyHash);
  const [enteredToken, setEnteredToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const token = enteredToken ?? fragment;

  async function acceptInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('Checking your invitation…');
    try {
      const result = await signIn('invite', { token, redirect: false, redirectTo: '/dashboard' });
      if (result?.error || !result?.ok)
        throw new Error(
          'This invitation is invalid, expired, or already used. Ask for a fresh link.',
        );
      window.history.replaceState(null, '', window.location.pathname);
      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sign-in is unavailable. Try again.');
      setPending(false);
    }
  }

  return (
    <div className="account-card">
      <p className="eyebrow">A place for your progress</p>
      <h1>{invitation ? 'Your next chapter is waiting.' : 'Welcome to your learning studio.'}</h1>
      <p>Sign in, choose a display name, and keep your course progress when you return.</p>
      <button
        className="button account-full"
        type="button"
        disabled={!readiness.google || pending}
        onClick={() => {
          setPending(true);
          void signIn('google', { redirectTo: '/dashboard' }).catch(() => {
            setPending(false);
            setMessage('Google sign-in is unavailable. Please try again.');
          });
        }}
      >
        Continue with Google
      </button>
      {!readiness.google && (
        <p className="small-note">
          Google sign-in will be available once the owner connects Google OAuth.
        </p>
      )}
      <div className="account-divider">
        <span>or use an invitation</span>
      </div>
      <form onSubmit={acceptInvitation}>
        <label htmlFor="invitation-token">Invitation code</label>
        <input
          id="invitation-token"
          name="token"
          type="password"
          autoComplete="off"
          value={token}
          maxLength={200}
          onChange={(event) => setEnteredToken(event.target.value)}
          required
          aria-describedby="invitation-help"
        />
        <p id="invitation-help" className="small-note">
          Your private invitation link fills this in. Each invitation can be used once.
        </p>
        <button
          className="button secondary account-full"
          disabled={!readiness.invitations || pending}
        >
          {pending ? 'Signing in…' : 'Accept invitation'}
        </button>
      </form>
      {!readiness.configured && (
        <p className="notice">
          Accounts are awaiting server configuration. The public course overview and blog are
          available now.
        </p>
      )}
      <p role="status" className="form-status">
        {message}
      </p>
      <p className="small-note">
        Google sign-up is open. An invitation is an alternative, not a requirement for Google users.
      </p>
    </div>
  );
}

export function SignOutButton() {
  return (
    <button className="text-link" onClick={() => void signOut({ redirectTo: '/' })}>
      Sign out
    </button>
  );
}

export function ProfileForm({ user }: { user: Learner }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [goal, setGoal] = useState(user.goal);
  const [timezone, setTimezone] = useState(user.timezone);
  const [revision, setRevision] = useState(user.revision);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('Saving your profile…');
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, goal, timezone, locale: 'en', revision }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Your profile could not be saved.');
      setRevision(body.user.revision);
      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.');
      setBusy(false);
    }
  }
  async function deleteAccount() {
    setBusy(true);
    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Account deletion failed.');
      await signOut({ redirectTo: '/' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.');
      setBusy(false);
    }
  }
  return (
    <div className="account-card">
      <p className="eyebrow">Your learning identity</p>
      <h1>{user.displayName ? 'Your profile.' : 'Make this space yours.'}</h1>
      <p>
        Your profile is private. Your email is used for sign-in; your display name is enough to
        begin.
      </p>
      <form onSubmit={save}>
        <label htmlFor="display-name">Display name</label>
        <input
          id="display-name"
          name="displayName"
          autoComplete="nickname"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          minLength={2}
          maxLength={60}
          required
        />
        <label htmlFor="learning-goal">
          Learning goal <span className="small-note">(optional)</span>
        </label>
        <textarea
          id="learning-goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          maxLength={500}
          rows={3}
        />
        <label htmlFor="profile-timezone">Timezone</label>
        <input
          id="profile-timezone"
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
          maxLength={80}
          placeholder="UTC"
        />
        <button className="button account-full" disabled={busy}>
          {busy ? 'Saving…' : 'Save profile and continue'}
        </button>
      </form>
      <p role="status" className="form-status">
        {message}
      </p>
      <details className="account-data-controls">
        <summary>My data and account</summary>
        <p>
          We save lesson reads and checkpoint outcomes for your progress and the owner’s learning
          support. Raw exercise submissions are not stored.
        </p>
        <a className="text-link" href="/api/account/download">
          Download my account data
        </a>
        <p className="small-note">
          Deletion removes your profile and learning history. A minimal deletion record prevents old
          synced copies from restoring the account; this email cannot sign up again.
        </p>
        <label htmlFor="delete-confirmation">
          Type DELETE to delete your account and learning history
        </label>
        <input
          id="delete-confirmation"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoComplete="off"
        />
        <button
          className="button secondary"
          disabled={confirmation !== 'DELETE' || busy}
          onClick={() => void deleteAccount()}
        >
          Delete my account
        </button>
      </details>
      <SignOutButton />
    </div>
  );
}
