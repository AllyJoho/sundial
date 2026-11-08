// Closing out a day: look at the timeline, fill in or fix anything (tap a gap or a block, set your own
// times), then rate mood/energy and add a note. Two uses: "Goodnight" (tonight, ends with starting your
// sleep) and closing out a past day. See product/features.md sections 5 and 8, and Sun Check 2026-11-07.
import { useMemo, useState } from 'react';
import { carryTasks, saveReview, startSleep } from '../actions';
import { coveredWithin, mergeIntervals, STREAK_MIN_TRACKED, type Day } from '../days';
import { formatDayTime, formatDuration } from '../format';
import type { Library } from '../hooks';
import { defaultCarry } from '../tasks';
import type { DayReview, Session, Task } from '../types';
import { DayTimeline } from './DayTimeline';
import { SessionEditor, type SessionDraft } from './SessionEditor';
import { Sheet } from './Sheet';

export type ReviewMode =
  | { kind: 'goodnight'; dayStart: number; bedtime: number }
  | { kind: 'close'; day: Day; label: string; initialStep?: 'timeline' | 'feel' };

type Step = 'timeline' | 'tasks' | 'feel';
type Carry = 'today' | 'later' | 'remove';

export const MOODS = ['😞', '🙁', '😐', '🙂', '😄'];
export const ENERGY = ['🪫', '😮‍💨', '😐', '⚡', '🔥'];

export function ReviewFlow({
  lib,
  sessions,
  tasks = [],
  mode,
  onClose,
}: {
  lib: Library;
  sessions: Session[];
  /** For goodnight: today's unfinished tasks get Tomorrow / Later / Remove. */
  tasks?: Task[];
  mode: ReviewMode;
  onClose: () => void;
}) {
  const start = mode.kind === 'goodnight' ? mode.dayStart : mode.day.start;
  const end = mode.kind === 'goodnight' ? mode.bedtime : mode.day.end!;
  const existing: DayReview | undefined = mode.kind === 'close' ? mode.day.review : undefined;

  // Editing an existing review jumps to mood/energy, unless asked to start at the timeline (e.g. to fill it in).
  const [step, setStep] = useState<Step>((mode.kind === 'close' && mode.initialStep) || (existing ? 'feel' : 'timeline'));
  const [editing, setEditing] = useState<{ session?: Session; draft?: SessionDraft } | null>(null);
  const [mood, setMood] = useState<number | undefined>(existing?.mood);
  const [energy, setEnergy] = useState<number | undefined>(existing?.energy);
  const [note, setNote] = useState(existing?.note ?? '');
  const [busy, setBusy] = useState(false);

  // Goodnight: what happens to today's unfinished to-dos (decided when the review opens).
  const [unfinished] = useState(() => (mode.kind === 'goodnight' ? tasks.filter((t) => t.list === 'today' && !t.doneAt) : []));
  const [carry, setCarry] = useState<Record<string, Carry>>(() => Object.fromEntries(unfinished.map((t) => [t.id, defaultCarry(unfinished)])));

  // How much of the day is tracked (overlapping blocks count once). Updates live as you fill things in.
  const tracked = useMemo(
    () => coveredWithin(mergeIntervals(sessions.filter((s) => !(s.kind === 'sleep' && s.sleepType === 'main')), end), start, end),
    [sessions, start, end],
  );
  const length = end - start;
  const moreNeeded = Math.max(0, Math.floor(length * STREAK_MIN_TRACKED) + 60_000 - tracked);

  async function finish(withFeelings: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      const fields = withFeelings ? { mood, energy, note: note.trim() || undefined } : {};
      if (mode.kind === 'goodnight') {
        if (withFeelings && unfinished.length) await carryTasks(carry);
        const sleepId = await startSleep('main', mode.bedtime);
        await saveReview(sleepId, fields);
      } else {
        await saveReview(mode.day.closingSleepId!, fields);
      }
      onClose();
    } finally {
      setBusy(false);
    }
  }

  const title =
    mode.kind === 'goodnight'
      ? 'Goodnight'
      : existing
        ? step === 'timeline'
          ? `Fill in ${mode.label}`
          : `${mode.label}: review`
        : `Close out ${mode.label}`;

  return (
    <Sheet title={title} onClose={onClose}>
      {step === 'timeline' && (
        <>
          <p className="muted" style={{ margin: 0 }}>
            {formatDayTime(start)} – {formatDayTime(end)} · {formatDuration(length)} awake
          </p>
          <p className="small" style={{ margin: 0 }}>
            {moreNeeded > 0 ? (
              <>
                Tap a gap to fill it in with your own times. <span className="muted">Fill in {formatDuration(moreNeeded)} more to count this day toward
                your streak. Untracked time is allowed either way.</span>
              </>
            ) : (
              <span className="muted">Tap any gap or block to fill it in or fix it. Untracked time is allowed.</span>
            )}
          </p>
          <DayTimeline
            lib={lib}
            sessions={sessions}
            start={start}
            end={end}
            askAboutGaps
            onEditSession={(s) => setEditing({ session: s })}
            onFillGap={(g) => setEditing({ draft: g })}
          />
          <div className="sheet-actions sticky-actions">
            <button className="btn primary" onClick={() => setStep(unfinished.length ? 'tasks' : 'feel')}>
              Next
            </button>
          </div>
          {mode.kind === 'goodnight' && (
            <button className="link-btn center" onClick={() => finish(false)} disabled={busy}>
              Skip the review, just go to sleep 🌙
            </button>
          )}
        </>
      )}

      {step === 'tasks' && (
        <>
          <p className="muted" style={{ margin: 0 }}>
            Not done today, and that's OK. What should happen to {unfinished.length === 1 ? 'it' : 'each one'}?
          </p>
          <ul className="carry-list">
            {unfinished.map((t) => (
              <li key={t.id} className="card carry-row">
                <div className="task-title">{t.title}</div>
                <div className="segmented" role="group" aria-label={`What to do with ${t.title}`}>
                  {(
                    [
                      ['today', 'Tomorrow'],
                      ['later', 'Later'],
                      ['remove', 'Remove'],
                    ] as const
                  ).map(([value, text]) => (
                    <button key={value} className={carry[t.id] === value ? 'on' : ''} onClick={() => setCarry({ ...carry, [t.id]: value })}>
                      {text}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <p className="muted small" style={{ margin: 0 }}>
            "Later" keeps everything (notes, due date, hours). "Remove" is for one-day things.
          </p>
          <div className="sheet-actions sticky-actions">
            <button className="btn primary" onClick={() => setStep('feel')}>
              Next
            </button>
          </div>
        </>
      )}

      {step === 'feel' && (
        <>
          <Scale label="Mood" icons={MOODS} value={mood} onChange={setMood} />
          <Scale label="Energy" icons={ENERGY} value={energy} onChange={setEnergy} />
          <label className="field">
            <span>How was {mode.kind === 'goodnight' ? 'today' : 'the day'}? (optional)</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="One line is plenty" />
          </label>
          <div className="sheet-actions">
            <button className="btn primary big" onClick={() => finish(true)} disabled={busy}>
              {mode.kind === 'goodnight' ? 'Good night 🌙' : existing ? 'Save' : 'Close out day ✓'}
            </button>
          </div>
          <button className="link-btn center" onClick={() => setStep(unfinished.length && !existing ? 'tasks' : 'timeline')}>
            ‹ {existing ? 'See or edit the timeline' : 'Back'}
          </button>
        </>
      )}

      {editing && <SessionEditor lib={lib} sessions={sessions} session={editing.session} draft={editing.draft} onClose={() => setEditing(null)} />}
    </Sheet>
  );
}

function Scale({ label, icons, value, onChange }: { label: string; icons: string[]; value?: number; onChange: (v?: number) => void }) {
  return (
    <div className="field">
      <span>
        {label} <span className="small">(optional)</span>
      </span>
      <div className="scale">
        {icons.map((icon, i) => (
          <button
            key={i}
            className={`scale-btn ${value === i + 1 ? 'on' : ''}`}
            onClick={() => onChange(value === i + 1 ? undefined : i + 1)}
            aria-label={`${label} ${i + 1} of 5`}
            aria-pressed={value === i + 1}
          >
            <span>{icon}</span>
            <small>{i + 1}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
