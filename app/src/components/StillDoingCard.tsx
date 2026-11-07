// "Still doing Gaming? It's been 3h 10m. Usually about 1h 20m." A nudge, not a scold.
import { useState } from 'react';
import { stopRunningAt } from '../actions';
import { formatDayTime, formatDuration, fromLocalInput, toLocalInput } from '../format';
import type { Library } from '../hooks';
import type { StillDoing } from '../nudges';
import { isSnoozed } from './CheckInCard';
import { Sheet } from './Sheet';

const SNOOZE_MS = 2 * 3600_000;
export const stillDoingKey = (s: StillDoing) => `still-${s.session.id}`;
export const stillDoingSnoozed = (s: StillDoing) => isSnoozed(stillDoingKey(s));

function snooze(key: string) {
  try {
    localStorage.setItem(`sundial.snooze.${key}`, String(Date.now() + SNOOZE_MS));
  } catch {
    /* storage unavailable: the card just shows again */
  }
}

export function StillDoingCard({ lib, check, onDone }: { lib: Library; check: StillDoing; onDone: () => void }) {
  const [picking, setPicking] = useState(false);
  const s = check.session;
  return (
    <section className="card checkin">
      <h3>
        Still doing {lib.sessionEmoji(s)} {lib.sessionLabel(s)}?
      </h3>
      <p className="muted">
        It's been {formatDuration(check.elapsed)}
        {check.typical !== null ? `. Usually about ${formatDuration(check.typical)}.` : '.'}
      </p>
      <div className="row-buttons">
        <button
          className="btn"
          onClick={() => {
            snooze(stillDoingKey(check));
            onDone();
          }}
        >
          Yes, still going
        </button>
        <button className="btn primary" onClick={() => setPicking(true)}>
          I stopped earlier
        </button>
      </div>
      {picking && <StoppedAtSheet check={check} onClose={() => setPicking(false)} />}
    </section>
  );
}

function StoppedAtSheet({ check, onClose }: { check: StillDoing; onClose: () => void }) {
  const start = check.session.start;
  const [openedAt] = useState(() => Date.now());
  const options = [
    ...(check.typical !== null ? [{ label: `After my usual ${formatDuration(check.typical)}`, at: start + check.typical }] : []),
    { label: '15 min ago', at: openedAt - 15 * 60_000 },
    { label: '30 min ago', at: openedAt - 30 * 60_000 },
    { label: '1h ago', at: openedAt - 60 * 60_000 },
  ].filter((o) => o.at > start);
  const [value, setValue] = useState(toLocalInput(options[0]?.at ?? openedAt));
  const t = fromLocalInput(value);
  const valid = t !== null && t > start && t <= Date.now();

  return (
    <Sheet title="When did you stop?" onClose={onClose}>
      <p className="muted" style={{ margin: 0 }}>
        Started {formatDayTime(start)}. The time after you stopped will show as untracked, and you can fill it in later.
      </p>
      <div className="chips">
        {options.map((o) => (
          <button key={o.label} className={`chip ${t !== null && Math.abs(t - o.at) < 60_000 ? 'on' : ''}`} onClick={() => setValue(toLocalInput(o.at))}>
            {o.label}
          </button>
        ))}
      </div>
      <label className="field">
        <span>Or pick the exact time</span>
        <input type="datetime-local" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      {!valid && <p className="form-error">Pick a time after it started and not in the future.</p>}
      <div className="sheet-actions">
        <button
          className="btn primary"
          disabled={!valid}
          onClick={async () => {
            await stopRunningAt(t!);
            onClose();
          }}
        >
          Save
        </button>
      </div>
    </Sheet>
  );
}
