// After-the-fact logging: "I did laundry for 30 min, ended 10 min ago." A few taps, no typing.
import { useMemo, useState } from 'react';
import { placeSession } from '../actions';
import { planInsert } from '../days';
import { formatDuration, formatTime } from '../format';
import type { Library } from '../hooks';
import type { Activity, Session } from '../types';
import { ActivitySelect } from './ActivityPicker';
import { OverlapNotice } from './OverlapNotice';
import { Sheet } from './Sheet';

const LENGTHS = [10, 15, 30, 45, 60, 90, 120];
const ENDED = [0, 10, 30, 60, 120];

export function LogPastSheet({ lib, sessions, choices, onClose }: { lib: Library; sessions: Session[]; choices: Activity[]; onClose: () => void }) {
  const [openedAt] = useState(() => Date.now());
  const [what, setWhat] = useState('');
  const [length, setLength] = useState(30);
  const [endedAgo, setEndedAgo] = useState(0);
  const [more, setMore] = useState(false);

  const end = openedAt - endedAgo * 60_000;
  const start = end - length * 60_000;
  const plan = useMemo(() => planInsert(sessions, start, end, Date.now()), [sessions, start, end]);

  async function save() {
    if (!what) return;
    await placeSession({ kind: 'activity', activityId: what.slice(4), start, end, source: 'manual' });
    onClose();
  }

  return (
    <Sheet title="Log past time" onClose={onClose}>
      <div className="field">
        <span>What did you do?</span>
        <div className="chips">
          {choices.map((a) => (
            <button key={a.id} className={`chip ${what === `act:${a.id}` ? 'on' : ''}`} onClick={() => setWhat(`act:${a.id}`)}>
              {lib.emoji(a)} {lib.label(a)}
            </button>
          ))}
          <button className={`chip ${more ? 'on-outline' : ''}`} onClick={() => setMore(!more)}>
            Other…
          </button>
        </div>
        {more && <ActivitySelect lib={lib} value={what} onChange={setWhat} includeSleep={false} />}
      </div>
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
      <OverlapNotice lib={lib} plan={plan} />
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
