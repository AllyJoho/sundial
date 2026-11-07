// Any day's timeline, with ‹ › to move between days. Edit anything, close out days you missed.
import { useEffect, useState } from 'react';
import type { AppData } from '../App';
import { DayTimeline } from '../components/DayTimeline';
import { GoalBars } from '../components/GoalBars';
import { ReviewFlow, type ReviewMode } from '../components/ReviewFlow';
import { SessionEditor, type SessionDraft } from '../components/SessionEditor';
import { countsForStreak, RECOVERY_WINDOW_MS } from '../days';
import { dayLabel, formatDayTime, formatDuration } from '../format';
import { goalProgress } from '../goals';
import { useNow } from '../hooks';
import type { Session } from '../types';

const MOODS = ['😞', '🙁', '😐', '🙂', '😄'];
const ENERGY = ['🪫', '😮‍💨', '😐', '⚡', '🔥'];

export function DaysScreen({ data }: { data: AppData }) {
  const { lib, sessions, days } = data;
  useNow(30_000); // re-draw every 30s so running blocks grow
  const now = Date.now();
  const [index, setIndex] = useState(days.length - 1);
  const [editing, setEditing] = useState<{ session?: Session; draft?: SessionDraft } | null>(null);
  const [review, setReview] = useState<ReviewMode | null>(null);

  // If a new day appears (e.g. you woke up), jump to it; keep the index valid if days are removed.
  const [count, setCount] = useState(days.length);
  useEffect(() => {
    if (days.length !== count) {
      setIndex(days.length - 1);
      setCount(days.length);
    }
  }, [days.length, count]);

  const editor = editing && (
    <SessionEditor lib={lib} sessions={sessions} session={editing.session} draft={editing.draft} onClose={() => setEditing(null)} />
  );

  // No wake-up logged yet: show since midnight.
  if (days.length === 0) {
    const midnight = new Date(now).setHours(0, 0, 0, 0);
    return (
      <div className="screen">
        <header className="day-header">
          <div className="day-title">Today</div>
          <div className="muted">Since midnight. Once you log a wake-up, days start when you wake.</div>
        </header>
        <DayTimeline
          lib={lib}
          sessions={sessions}
          start={midnight}
          end={now}
          onEditSession={(s) => setEditing({ session: s })}
          onFillGap={(g) => setEditing({ draft: g })}
        />
        {editor}
      </div>
    );
  }

  const i = Math.min(Math.max(index, 0), days.length - 1);
  const day = days[i];
  const stepsBack = days.length - 1 - i;
  const label = dayLabel(day.start, stepsBack);
  const end = day.end ?? now;
  const dailyGoals = data.goals
    .filter((g) => !g.archived && g.period === 'day')
    .map((g) => goalProgress(g, lib.activities, sessions, day.start, end, now));

  return (
    <div className="screen">
      <header className="day-nav">
        <button className="icon-btn big-arrow" onClick={() => setIndex(i - 1)} disabled={i === 0} aria-label="Previous day">
          ‹
        </button>
        <div className="day-nav-title">
          <div className="day-title">{label}</div>
          <div className="muted small">
            {formatDayTime(day.start)} – {day.end ? formatDayTime(day.end) : 'now'} · {formatDuration(end - day.start)} awake
          </div>
        </div>
        <button className="icon-btn big-arrow" onClick={() => setIndex(i + 1)} disabled={i === days.length - 1} aria-label="Next day">
          ›
        </button>
      </header>
      {stepsBack === 0 && days.length > 1 && (
        <button className="link-btn center" onClick={() => setIndex(i - 1)}>
          ‹ See yesterday
        </button>
      )}

      {day.end !== null && (
        <section className={`card ${day.review ? '' : 'recover'}`}>
          {day.review ? (
            <>
              <div className="review-row">
                <span>
                  ✓ Closed out
                  {!countsForStreak(day) && <span className="muted small"> (after the 2-day window, so not part of the streak)</span>}
                </span>
                <button className="link-btn" onClick={() => setReview({ kind: 'close', day, label })}>
                  Edit
                </button>
              </div>
              {(day.review.mood || day.review.energy || day.review.note) && (
                <p className="muted" style={{ margin: '6px 0 0' }}>
                  {day.review.mood && `Mood ${MOODS[day.review.mood - 1]} `}
                  {day.review.energy && `· Energy ${ENERGY[day.review.energy - 1]} `}
                  {day.review.note && `· “${day.review.note}”`}
                </p>
              )}
            </>
          ) : (
            <>
              <p>
                <strong>Not closed out yet.</strong>{' '}
                {data.streak.frozen.has(day.start) && <>A streak freeze 🧊 covered it, so your streak kept going. </>}
                {now <= day.end + RECOVERY_WINDOW_MS
                  ? 'Close it out to count it toward your streak.'
                  : "It's past the 2-day window for the streak, but you can still close it for your own records."}
              </p>
              <button className="btn primary" onClick={() => setReview({ kind: 'close', day, label })}>
                Close out {label}
              </button>
            </>
          )}
        </section>
      )}

      {dailyGoals.length > 0 && (
        <section className="card">
          <GoalBars lib={lib} progress={dailyGoals} />
        </section>
      )}

      <DayTimeline
        lib={lib}
        sessions={sessions}
        start={day.start}
        end={end}
        onEditSession={(s) => setEditing({ session: s })}
        onFillGap={(g) => setEditing({ draft: g })}
      />

      <button
        className="btn"
        onClick={() => setEditing({ draft: { start: Math.max(day.start, end - 30 * 60_000), end } })}
      >
        + Add time
      </button>

      {editor}
      {review && <ReviewFlow lib={lib} sessions={sessions} mode={review} onClose={() => setReview(null)} />}
    </div>
  );
}
