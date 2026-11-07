// Gentle check-ins on the home screen:
//  - "Did you sleep?" when you've been up a very long time or there's a long untracked stretch (forgot goodnight / all-nighter)
//  - "Still asleep?" when a sleep timer has run very long (forgot good morning)
import { useMemo, useState } from 'react';
import { logMissedSleep, wakeUp } from '../actions';
import { planInsert, type CheckIn } from '../days';
import { formatDayTime, formatDuration, fromLocalInput, toLocalInput } from '../format';
import type { Library } from '../hooks';
import type { Session } from '../types';
import { OverlapNotice } from './OverlapNotice';
import { Sheet } from './Sheet';

const SNOOZE_MS = 6 * 3600_000;

/** Remembers "not now" answers on this device. Wrapped in try/catch because storage can be unavailable. */
export function isSnoozed(key: string): boolean {
  try {
    return Number(localStorage.getItem(`sundial.snooze.${key}`) ?? 0) > Date.now();
  } catch {
    return false;
  }
}
function snooze(key: string) {
  try {
    localStorage.setItem(`sundial.snooze.${key}`, String(Date.now() + SNOOZE_MS));
  } catch {
    /* ignore */
  }
}
export const checkInKey = (c: CheckIn) => (c.type === 'long-sleep' ? `sleep-${c.session.id}` : `missed-${c.dayStart}`);

export function CheckInCard({
  lib,
  sessions,
  checkIn,
  now,
  onSnooze,
  onSleepLogged,
}: {
  lib: Library;
  sessions: Session[];
  checkIn: CheckIn;
  now: number;
  onSnooze: () => void;
  /** Called with the new sleep's id, so the day it ended can be closed out right away. */
  onSleepLogged: (sleepId: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (checkIn.type === 'long-sleep') {
    const nap = checkIn.session.sleepType === 'nap';
    return (
      <section className="card checkin">
        <h3>{nap ? 'Long nap?' : 'Still asleep?'}</h3>
        <p className="muted">
          Your {nap ? 'nap' : 'sleep'} timer has been running since {formatDayTime(checkIn.session.start)} (
          {formatDuration(now - checkIn.session.start)}). If you woke up earlier, you can fix it.
        </p>
        <div className="row-buttons">
          <button className="btn primary" onClick={() => setEditing(true)}>
            I woke up earlier
          </button>
          <button
            className="btn"
            onClick={() => {
              snooze(checkInKey(checkIn));
              onSnooze();
            }}
          >
            Still {nap ? 'napping' : 'asleep'}
          </button>
        </div>
        {editing && <WakeSheet session={checkIn.session} suggest={checkIn.suggestWake} onClose={() => setEditing(false)} />}
      </section>
    );
  }

  return (
    <section className="card checkin">
      <h3>Did you sleep?</h3>
      <p className="muted">
        You've been up since {formatDayTime(checkIn.dayStart)} ({formatDuration(checkIn.awakeMs)}). It looks like you might
        have slept around {formatDayTime(checkIn.suggestStart)} – {formatDayTime(checkIn.suggestEnd)}.
      </p>
      <div className="row-buttons">
        <button className="btn primary" onClick={() => setEditing(true)}>
          Yes, log my sleep
        </button>
        <button
          className="btn"
          onClick={() => {
            snooze(checkInKey(checkIn));
            onSnooze();
          }}
        >
          No, still going
        </button>
      </div>
      {editing && (
        <MissedSleepSheet
          lib={lib}
          sessions={sessions}
          suggestStart={checkIn.suggestStart}
          suggestEnd={checkIn.suggestEnd}
          onClose={() => setEditing(false)}
          onSaved={onSleepLogged}
        />
      )}
    </section>
  );
}

function WakeSheet({ session, suggest, onClose }: { session: Session; suggest: number; onClose: () => void }) {
  const [value, setValue] = useState(toLocalInput(suggest));
  const t = fromLocalInput(value);
  const valid = t !== null && t > session.start && t <= Date.now();
  return (
    <Sheet title="When did you wake up?" onClose={onClose}>
      <p className="muted" style={{ margin: 0 }}>
        Fell asleep {formatDayTime(session.start)}
      </p>
      <label className="field">
        <span>Woke up</span>
        <input type="datetime-local" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      {t !== null && valid && <p className="muted">Slept {formatDuration(t - session.start)}</p>}
      {!valid && <p className="form-error">Pick a time after you fell asleep and not in the future.</p>}
      <div className="sheet-actions">
        <button
          className="btn primary"
          disabled={!valid}
          onClick={async () => {
            await wakeUp(t!);
            onClose();
          }}
        >
          Save
        </button>
      </div>
    </Sheet>
  );
}

export function MissedSleepSheet({
  lib,
  sessions,
  suggestStart,
  suggestEnd,
  onClose,
  onSaved,
}: {
  lib: Library;
  sessions: Session[];
  suggestStart: number;
  suggestEnd: number;
  onClose: () => void;
  onSaved: (sleepId: string) => void;
}) {
  const [from, setFrom] = useState(toLocalInput(suggestStart));
  const [to, setTo] = useState(toLocalInput(suggestEnd));
  const s = fromLocalInput(from);
  const e = fromLocalInput(to);
  const valid = s !== null && e !== null && e > s && e <= Date.now() + 60_000;
  const plan = useMemo(() => (valid ? planInsert(sessions, s!, e!, Date.now()) : null), [valid, sessions, s, e]);

  return (
    <Sheet title="Log your sleep" onClose={onClose}>
      <label className="field">
        <span>Fell asleep</span>
        <input type="datetime-local" value={from} onChange={(ev) => setFrom(ev.target.value)} />
      </label>
      <label className="field">
        <span>Woke up</span>
        <input type="datetime-local" value={to} onChange={(ev) => setTo(ev.target.value)} />
      </label>
      {valid && <p className="muted">Slept {formatDuration(e! - s!)}</p>}
      {plan && <OverlapNotice lib={lib} plan={plan} />}
      {!valid && <p className="form-error">Wake time should be after sleep time, and not in the future.</p>}
      <div className="sheet-actions">
        <button
          className="btn primary"
          disabled={!valid}
          onClick={async () => {
            const id = await logMissedSleep(s!, e!);
            onClose();
            onSaved(id);
          }}
        >
          Save sleep
        </button>
      </div>
    </Sheet>
  );
}
