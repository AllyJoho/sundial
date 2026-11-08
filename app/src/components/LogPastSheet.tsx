// After-the-fact logging: "I did laundry for 30 min, ended 10 min ago." A few taps, no typing. Naps too.
import { useMemo, useState } from 'react';
import { placeSession } from '../actions';
import { planInsert } from '../days';
import { formatDuration, formatTime } from '../format';
import type { Library } from '../hooks';
import type { Session } from '../types';
import { ActivityField } from './ActivityField';
import { OverlapNotice } from './OverlapNotice';
import { Sheet } from './Sheet';

const LENGTHS = [10, 15, 30, 45, 60, 90, 120];
const ENDED = [0, 10, 30, 60, 120];

export function LogPastSheet({ lib, sessions, onClose }: { lib: Library; sessions: Session[]; onClose: () => void }) {
  const [openedAt] = useState(() => Date.now());
  const [what, setWhat] = useState('');
  const [length, setLength] = useState(30);
  const [endedAgo, setEndedAgo] = useState(0);
  const [keepBoth, setKeepBoth] = useState(true);

  const end = openedAt - endedAgo * 60_000;
  const start = end - length * 60_000;
  const plan = useMemo(() => planInsert(sessions, start, end, Date.now()), [sessions, start, end]);

  async function save() {
    if (!what) return;
    const block =
      what === 'sleep:nap'
        ? { kind: 'sleep' as const, activityId: null, sleepType: 'nap' as const, start, end, source: 'manual' as const }
        : { kind: 'activity' as const, activityId: what.slice(4), start, end, source: 'manual' as const };
    await placeSession(block, { keepOverlaps: keepBoth });
    onClose();
  }

  return (
    <Sheet title="Log past time" onClose={onClose}>
      <ActivityField lib={lib} sessions={sessions} value={what} onChange={setWhat} includeSleep="nap" label="What did you do?" />
      <div className="field">
        <span>For how long?</span>
        <div className="chips">
          {LENGTHS.map((m) => (
            <button key={m} className={`chip ${length === m ? 'on' : ''}`} onClick={() => setLength(m)}>
              {formatDuration(m * 60_000)}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <span>Ended</span>
        <div className="chips">
          {ENDED.map((m) => (
            <button key={m} className={`chip ${endedAgo === m ? 'on' : ''}`} onClick={() => setEndedAgo(m)}>
              {m === 0 ? 'just now' : `${formatDuration(m * 60_000)} ago`}
            </button>
          ))}
        </div>
      </div>
      <p className="muted" style={{ margin: 0 }}>
        {formatTime(start)} – {formatTime(end)} · {formatDuration(length * 60_000)}
      </p>
      <OverlapNotice lib={lib} plan={plan} keepBoth={keepBoth} onKeepBothChange={setKeepBoth} />
      <p className="muted small" style={{ margin: 0 }}>
        Need exact times? Use + Add time on the Days tab.
      </p>
      <div className="sheet-actions">
        <button className="btn primary" onClick={save} disabled={!what}>
          {what ? 'Save' : 'Choose what you did'}
        </button>
      </div>
    </Sheet>
  );
}
