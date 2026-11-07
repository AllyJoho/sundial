// Closing out a day: look at the timeline, fill in big gaps, rate mood/energy, add a note.
// Two uses: "Goodnight" (tonight, ends with starting your sleep) and closing out a past day
// (forgot goodnight, or rebuilding a missed day to keep a streak). See product/features.md sections 5 and 8.
import { useMemo, useState } from 'react';
import { placeSession, saveReview, startSleep } from '../actions';
import { DOWNTIME_ID } from '../db';
import { gapChunks, needsRebuild, type Day } from '../days';
import { formatDayTime, formatDuration, formatTime } from '../format';
import type { Library } from '../hooks';
import type { Activity, DayReview, Session } from '../types';
import { ActivitySelect } from './ActivityPicker';
import { DayTimeline } from './DayTimeline';
import { Sheet } from './Sheet';

export type ReviewMode =
  | { kind: 'goodnight'; dayStart: number; bedtime: number }
  | { kind: 'close'; day: Day; label: string };

type Step = 'timeline' | 'gaps' | 'feel';

const MOODS = ['😞', '🙁', '😐', '🙂', '😄'];
const ENERGY = ['🪫', '😮‍💨', '😐', '⚡', '🔥'];

export function ReviewFlow({
  lib,
  sessions,
  mode,
  onClose,
}: {
  lib: Library;
  sessions: Session[];
  mode: ReviewMode;
  onClose: () => void;
}) {
  const start = mode.kind === 'goodnight' ? mode.dayStart : mode.day.start;
  const end = mode.kind === 'goodnight' ? mode.bedtime : mode.day.end!;
  const existing: DayReview | undefined = mode.kind === 'close' ? mode.day.review : undefined;

  // Freeze the gaps when the flow opens, so filling one doesn't reshuffle the list.
  const [{ rebuild, chunks }] = useState(() => {
    const rebuild = mode.kind === 'close' && !existing && needsRebuild(sessions, start, end);
    return { rebuild, chunks: gapChunks(sessions, start, end, rebuild) };
  });
  const [step, setStep] = useState<Step>(existing ? 'feel' : 'timeline');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [mood, setMood] = useState<number | undefined>(existing?.mood);
  const [energy, setEnergy] = useState<number | undefined>(existing?.energy);
  const [note, setNote] = useState(existing?.note ?? '');
  const [busy, setBusy] = useState(false);

  const allAnswered = chunks.every((_, i) => answers[i] && answers[i] !== 'skip');

  async function saveGaps() {
    for (const [i, value] of Object.entries(answers)) {
      if (!value.startsWith('act:')) continue;
      const c = chunks[Number(i)];
      await placeSession({ kind: 'activity', activityId: value.slice(4), start: c.start, end: c.end, source: 'manual' });
    }
  }

  async function finish(withFeelings: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      const fields = withFeelings ? { mood, energy, note: note.trim() || undefined } : {};
      if (mode.kind === 'goodnight') {
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
    mode.kind === 'goodnight' ? 'Goodnight' : existing ? `${mode.label}: review` : rebuild ? `Rebuild ${mode.label}` : `Close out ${mode.label}`;

  return (
    <Sheet title={title} onClose={onClose}>
      {step === 'timeline' && (
        <>
          <p className="muted" style={{ margin: 0 }}>
            {formatDayTime(start)} – {formatDayTime(end)} · {formatDuration(end - start)} awake
          </p>
          <DayTimeline lib={lib} sessions={sessions} start={start} end={end} />
          <div className="sheet-actions sticky-actions">
            <button className="btn primary" onClick={() => setStep(chunks.length ? 'gaps' : 'feel')}>
              {chunks.length ? 'Next: fill in gaps' : 'Next'}
            </button>
          </div>
          {mode.kind === 'goodnight' && (
            <button className="link-btn center" onClick={() => finish(false)} disabled={busy}>
              Skip the review, just go to sleep 🌙
            </button>
          )}
        </>
      )}

      {step === 'gaps' && (
        <>
          {rebuild ? (
            <p className="muted" style={{ margin: 0 }}>
              Most of this day wasn't tracked. To close it out, sketch it in rough blocks. A best guess is fine, and
              "Downtime" counts.
            </p>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              What were these? Skip any you don't remember. Untracked time is allowed.
            </p>
          )}
          {chunks.map((c, i) => (
            <GapQuestion
              key={c.start}
              lib={lib}
              sessions={sessions}
              start={c.start}
              end={c.end}
              value={answers[i]}
              canSkip={!rebuild}
              onChange={(v) => setAnswers((a) => ({ ...a, [i]: v }))}
            />
          ))}
          <div className="sheet-actions sticky-actions">
            <button
              className="btn primary"
              disabled={(rebuild && !allAnswered) || busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await saveGaps();
                  setStep('feel');
                } finally {
                  setBusy(false);
                }
              }}
            >
              {rebuild && !allAnswered ? `Answer all ${chunks.length} to continue` : 'Next'}
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
        </>
      )}
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

/** One "What was this?" card with quick choices. */
function GapQuestion({
  lib,
  sessions,
  start,
  end,
  value,
  canSkip,
  onChange,
}: {
  lib: Library;
  sessions: Session[];
  start: number;
  end: number;
  value?: string;
  canSkip: boolean;
  onChange: (v: string) => void;
}) {
  const [more, setMore] = useState(false);
  const choices = useMemo(() => quickChoices(lib, sessions), [lib, sessions]);
  const chosenId = value?.startsWith('act:') ? value.slice(4) : undefined;
  const chosenIsQuick = !chosenId || choices.some((a) => a.id === chosenId);

  return (
    <div className="card gap-q">
      <div className="gap-q-time">
        {formatTime(start)} – {formatTime(end)} <span className="muted">· {formatDuration(end - start)}</span>
      </div>
      <div className="chips">
        {choices.map((a) => (
          <button key={a.id} className={`chip ${chosenId === a.id ? 'on' : ''}`} onClick={() => onChange(`act:${a.id}`)}>
            {lib.emoji(a)} {lib.label(a)}
          </button>
        ))}
        <button className={`chip ${more || !chosenIsQuick ? 'on-outline' : ''}`} onClick={() => setMore(!more)}>
          Other…
        </button>
        {canSkip && (
          <button className={`chip ${value === 'skip' ? 'on' : ''}`} onClick={() => onChange('skip')}>
            Skip
          </button>
        )}
      </div>
      {(more || !chosenIsQuick) && (
        <ActivitySelect lib={lib} value={value?.startsWith('act:') ? value : ''} onChange={onChange} includeSleep={false} />
      )}
    </div>
  );
}

/** Downtime, favorites, then recently used: the things you're most likely to pick. */
export function quickChoices(lib: Library, sessions: Session[]): Activity[] {
  const out: Activity[] = [];
  const add = (a?: Activity) => a && !a.archived && !out.some((x) => x.id === a.id) && out.push(a);
  add(lib.activityById.get(DOWNTIME_ID));
  for (let i = sessions.length - 1; i >= 0 && out.length < 6; i--) {
    const s = sessions[i];
    if (s.kind === 'activity' && s.activityId) add(lib.activityById.get(s.activityId));
  }
  lib.activities.filter((a) => a.favorite).forEach((a) => out.length < 6 && add(a));
  return out;
}
