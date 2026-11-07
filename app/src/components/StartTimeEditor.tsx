// "When did you start?" for something that's still running.
// For when you remember to log 20 minutes into an activity (or a nap).
import { useMemo, useState } from 'react';
import { changeStart } from '../actions';
import { planStartChange } from '../day';
import { formatDayTime, formatDuration, fromLocalInput, toLocalInput } from '../format';
import type { Library } from '../hooks';
import type { Session } from '../types';
import { Sheet } from './Sheet';

const QUICK_MINUTES = [5, 10, 15, 20, 30, 45, 60, 90];

export function StartTimeEditor({
  lib,
  session,
  sessions,
  onClose,
}: {
  lib: Library;
  session: Session;
  sessions: Session[];
  onClose: () => void;
}) {
  // Freeze "now" when the sheet opens so the quick buttons don't shift while you're choosing.
  const [openedAt] = useState(() => Date.now());
  const [value, setValue] = useState(toLocalInput(session.start));
  const newStart = fromLocalInput(value);

  const plan = useMemo(
    () => (newStart === null ? { trim: [], remove: [] } : planStartChange(sessions, session, newStart)),
    [sessions, session, newStart],
  );

  let error = '';
  if (newStart === null) error = 'Choose a time.';
  else if (newStart > Date.now()) error = "Start time can't be in the future.";

  async function save() {
    if (error || newStart === null) return;
    await changeStart(session.id, newStart);
    onClose();
  }

  return (
    <Sheet title="When did you start?" onClose={onClose}>
      <p className="muted" style={{ margin: 0 }}>
        {lib.sessionEmoji(session)} {lib.sessionLabel(session)}
      </p>
      <div className="chips">
        {QUICK_MINUTES.map((m) => {
          const t = openedAt - m * 60_000;
          const chosen = newStart !== null && Math.abs(newStart - t) < 60_000;
          return (
            <button key={m} className={`chip ${chosen ? 'on' : ''}`} onClick={() => setValue(toLocalInput(t))}>
              {m < 60 ? `${m} min ago` : `${formatDuration(m * 60_000)} ago`}
            </button>
          );
        })}
      </div>
      <label className="field">
        <span>Or pick the exact time</span>
        <input type="datetime-local" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>

      {!error && newStart !== null && (plan.trim.length > 0 || plan.remove.length > 0) && (
        <div className="notice">
          {plan.trim.map((s) => (
            <p key={s.id}>
              {lib.sessionEmoji(s)} <strong>{lib.sessionLabel(s)}</strong> will now end at {formatDayTime(newStart)}.
            </p>
          ))}
          {plan.remove.map((s) => (
            <p key={s.id}>
              {lib.sessionEmoji(s)} <strong>{lib.sessionLabel(s)}</strong> ({formatDayTime(s.start)}, {formatDuration((s.end ?? openedAt) - s.start)}) is
              covered by this and will be removed.
            </p>
          ))}
        </div>
      )}
      {error && <p className="form-error">{error}</p>}

      <div className="sheet-actions">
        <button className="btn primary" onClick={save} disabled={!!error}>
          Save
        </button>
      </div>
    </Sheet>
  );
}
