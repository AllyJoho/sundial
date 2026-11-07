// Sign-in screens for sync: enter your email, then the code that's emailed to you. No passwords.
// Dexie Cloud tells us what to ask for (db.cloud.userInteraction); we just draw it in Sundial's style.
// Only rendered when sync is set up.
import { useState } from 'react';
import { useObservable } from 'dexie-react-hooks';
import { resolveText, type DXCUserInteraction } from 'dexie-cloud-addon';
import { db } from '../db';
import { Sheet } from './Sheet';

export function LoginDialog() {
  const ui = useObservable(db.cloud.userInteraction) as DXCUserInteraction | undefined;
  if (!ui) return null;
  // key: a fresh form for each new step (email → code), so typed values don't carry over.
  return <InteractionSheet key={`${ui.type}-${ui.title}`} ui={ui} />;
}

function InteractionSheet({ ui }: { ui: DXCUserInteraction }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const fields = Object.entries(ui.fields ?? {}) as [string, { type: string; label?: string; placeholder?: string }][];
  const friendly = friendlyCopy(ui);

  return (
    <Sheet title={friendly.title} onClose={() => ui.onCancel()}>
      {friendly.intro && (
        <p className="muted" style={{ margin: 0 }}>
          {friendly.intro}
        </p>
      )}
      {ui.alerts.map((a, i) => (
        <p key={i} className={a.type === 'error' ? 'form-error' : 'notice'}>
          {resolveText(a)}
        </p>
      ))}
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          ui.onSubmit(values as never);
        }}
      >
        {fields.map(([name, f]) => (
          <label key={name} className="field">
            <span>{f.label ?? (name === 'email' ? 'Email' : name === 'otp' ? 'Code from the email' : name)}</span>
            <input
              autoFocus
              type={name === 'email' ? 'email' : 'text'}
              inputMode={name === 'otp' ? 'numeric' : undefined}
              autoComplete={name === 'email' ? 'email' : name === 'otp' ? 'one-time-code' : undefined}
              placeholder={f.placeholder}
              value={values[name] ?? ''}
              onChange={(e) => setValues({ ...values, [name]: e.target.value.trim() })}
            />
          </label>
        ))}
        <div className="sheet-actions">
          <button className="btn primary" type="submit">
            {ui.type === 'email' ? 'Send me a code' : ui.type === 'otp' ? 'Sign in' : ui.submitLabel}
          </button>
          {ui.cancelLabel && (
            <button className="btn" type="button" onClick={() => ui.onCancel()}>
              {ui.cancelLabel}
            </button>
          )}
        </div>
      </form>
    </Sheet>
  );
}

/** Plain-language titles for the common steps; anything else uses Dexie Cloud's own wording. */
function friendlyCopy(ui: DXCUserInteraction): { title: string; intro?: string } {
  if (ui.type === 'email') return { title: 'Sign in to sync', intro: "We'll email you a code. No password needed." };
  if (ui.type === 'otp') return { title: 'Check your email', intro: 'Enter the code we just sent you.' };
  if (ui.type === 'logout-confirmation')
    return { title: 'Sign out?', intro: "Some changes on this device haven't synced yet. Signing out now would lose them." };
  return { title: ui.title };
}
