// Account & sync: sign in with your email to keep your phone and computer in sync.
import { useObservable } from 'dexie-react-hooks';
import type { SyncState, UserLogin } from 'dexie-cloud-addon';
import { cloudEnabled } from '../cloud';
import { LocalImportCard } from '../components/LocalImportCard';
import { useState } from 'react';
import { db } from '../db';
import { importDecision, resetImportDecision } from '../localImport';

export function AccountPage() {
  if (!cloudEnabled) {
    return (
      <>
        <section className="card">
          <h3 className="card-title">Sync isn't set up yet</h3>
          <p className="muted">
            Right now everything stays on this device. Once sync is set up (a one-time step on the computer, described in
            README.md under "Accounts & sync"), you'll be able to sign in here with just your email, and your phone and
            computer will stay in sync.
          </p>
          <p className="muted small">Until then, you can move data between devices with More → Backup & export.</p>
        </section>
      </>
    );
  }
  return <CloudAccount />;
}

function CloudAccount() {
  // Bumped to re-check for earlier data after undoing "Don't copy".
  const [attempt, rerender] = useState(0);
  const user = useObservable(db.cloud.currentUser) as UserLogin | undefined;
  const sync = useObservable(db.cloud.syncState) as SyncState | undefined;
  const signedIn = !!user?.isLoggedIn;

  return (
    <>
      <LocalImportCard key={attempt} />
      {importDecision() === 'skipped' && (
        <button
          className="link-btn"
          onClick={() => {
            resetImportDecision();
            rerender((n) => n + 1);
          }}
        >
          Copy this device's earlier (pre-sync) data after all…
        </button>
      )}
      <section className="card">
        {signedIn ? (
          <>
            <h3 className="card-title">Signed in</h3>
            <p style={{ marginTop: 0 }}>{user?.email}</p>
            <p className="muted">
              <SyncStatus state={sync} />
            </p>
            {user?.license?.type === 'eval' && user.license.evalDaysLeft !== undefined && (
              <p className="muted small">Trial account: {user.license.evalDaysLeft} days left (see README: Accounts & sync).</p>
            )}
            <div className="row-buttons">
              <button className="btn" onClick={() => db.cloud.sync()}>
                Sync now
              </button>
              <button className="btn" onClick={() => db.cloud.logout()}>
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="card-title">Sync your devices</h3>
            <p className="muted">
              Sign in with your email on your phone and your computer, and Sundial keeps them the same. We'll email you a code.
              No password.
            </p>
            <p className="muted small">Sundial keeps working offline. Changes sync whenever you're online.</p>
            <button className="btn primary" onClick={() => db.cloud.login({ grant_type: 'otp' })}>
              Sign in with email
            </button>
          </>
        )}
      </section>
    </>
  );
}

function SyncStatus({ state }: { state?: SyncState }) {
  if (!state) return <>Checking…</>;
  if (state.license && state.license !== 'ok') return <>⚠️ Sync is paused: the account's license is {state.license}.</>;
  switch (state.phase) {
    case 'in-sync':
      return <>✓ Up to date</>;
    case 'pushing':
    case 'pulling':
    case 'initial':
    case 'not-in-sync':
      return <>Syncing…</>;
    case 'offline':
      return <>Offline. Changes will sync when you're back online.</>;
    case 'error':
      return <>Couldn't sync{state.error?.message ? `: ${state.error.message}` : ''}. It'll try again.</>;
    default:
      return <>{state.phase}</>;
  }
}

/** A short status for the More menu. */
export function SyncBadge() {
  const user = useObservable(db.cloud.currentUser) as UserLogin | undefined;
  const sync = useObservable(db.cloud.syncState) as SyncState | undefined;
  if (!user?.isLoggedIn) return <>Not signed in</>;
  if (sync?.phase === 'error') return <>Sync problem</>;
  if (sync?.phase === 'offline') return <>Offline</>;
  return <>{user.email}</>;
}
