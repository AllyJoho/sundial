// The Today tab: what's happening now, quick start, and the day's diary, all in one place
// (Sun Check 2026-11-07, "Today and Plan"; inspired by MyFitnessPal's Diary).
//   ‹ Today ›              ← arrows go back to past days (diary only)
//   live timer, check-ins, "What are you doing?", Your usual
//   summary · goals · sleep
//   Diary: the day's timeline, with "+ Add"
//   To do today (+ Later)
//   🌙 Complete today      ← goodnight (or "Close out" for a past day)
import { useEffect, useMemo, useState } from 'react';
import type { AppData } from '../App';
import { endRoutine, goToRoutineStep, logPastSleep, startActivity, startSleep, stopRunning, wakeUp } from '../actions';
import { ActivitySearch } from '../components/ActivitySearch';
import { CheckInCard, checkInKey, isSnoozed } from '../components/CheckInCard';
import { DaySummary, Diary } from '../components/DayTimeline';
import { GoalBars } from '../components/GoalBars';
import { LocalImportCard } from '../components/LocalImportCard';
import type { QuickAction } from '../components/QuickLog';
import { ENERGY, MOODS, ReviewFlow, type ReviewMode } from '../components/ReviewFlow';
import { SessionEditor, type SessionDraft } from '../components/SessionEditor';
import { SleepCard } from '../components/SleepCard';
import { StartTimeEditor } from '../components/StartTimeEditor';
import { StillDoingCard, stillDoingSnoozed } from '../components/StillDoingCard';
import { OpenNowCard, TodoList } from '../components/TodoList';
import { cloudEnabled } from '../cloud';
import { countsForStreak, detectCheckIn, moreNeededMs, RECOVERY_WINDOW_MS, type Day, type StreakInfo } from '../days';
import { dayLabel, formatClock, formatDayTime, formatDuration, fromLocalInput, toLocalInput } from '../format';
import { goalProgress } from '../goals';
import { useNow } from '../hooks';
import { stillDoingCheck } from '../nudges';
import type { Activity, Session } from '../types';
import { usageStats, usualActivities } from '../usual';

/** "Your usual" shows this many activity tiles, plus a Nap tile. */
const USUAL_COUNT = 5;

export function TodayScreen({ data, openQuick }: { data: AppData; openQuick: (a: QuickAction) => void }) {
  const { lib, sessions, day, days, streak } = data;
  const now = useNow(1000);
  const [index, setIndex] = useState<number | null>(null); // null = the latest day
  const [editing, setEditing] = useState<{ session?: Session; draft?: SessionDraft } | null>(null);
  const [review, setReview] = useState<ReviewMode | null>(null);
  const [closingSleepId, setClosingSleepId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState(false);
  const [, setSnoozeTick] = useState(0);

  // When a new day starts (you woke up), jump back to it.
  const [count, setCount] = useState(days.length);
  useEffect(() => {
    if (days.length !== count) {
      setIndex(null);
      setCount(days.length);
    }
  }, [days.length, count]);

  const latest = days.length - 1;
  const i = index === null ? latest : Math.min(Math.max(index, 0), latest);
  const isLatest = i === latest;
  const viewDay: Day | undefined = days[i];
  const stepsBack = latest - i;
  const label = viewDay ? dayLabel(viewDay.start, stepsBack) : 'Today';
  const midnight = useMemo(() => new Date(now).setHours(0, 0, 0, 0), [Math.floor(now / 3_600_000)]);
  const start = viewDay?.start ?? midnight;
  const end = viewDay?.end ?? now;

  const running = useMemo(() => sessions.find((s) => s.end === null), [sessions]);
  const lastEnded = useMemo(() => sessions.filter((s) => s.end !== null && s.end <= now).reduce((m, s) => Math.max(m, s.end!), 0), [sessions, now]);
  const usual = useMemo(() => usualActivities(lib.activities, usageStats(sessions, Date.now()), USUAL_COUNT), [lib, sessions]);

  // Check-ins and nudges, re-checked once a minute.
  const minute = Math.floor(now / 60_000);
  const checkIn = useMemo(() => detectCheckIn(sessions, day, Date.now()), [sessions, day, minute]);
  const showCheckIn = checkIn && !isSnoozed(checkInKey(checkIn));
  const stillDoing = useMemo(() => stillDoingCheck(sessions, Date.now()), [sessions, minute]);
  const showStillDoing = !showCheckIn && stillDoing && !stillDoingSnoozed(stillDoing);

  const active = data.settings.activeRoutine;
  const routine = active ? data.routines.find((r) => r.id === active.routineId) : undefined;

  const labelFor = (dayStart: number) => dayLabel(dayStart, latest - days.findIndex((d) => d.start === dayStart));
  const dayToClose = closingSleepId ? days.find((d) => d.closingSleepId === closingSleepId) : undefined;
  const recover = streak.recoverable[0];
  const showRecover = isLatest && !showCheckIn && !!recover && running?.kind !== 'sleep';

  // Goals: everything (incl. weekly) for the current day; daily goals for a past day.
  const goalBars = data.goals
    .filter((g) => !g.archived && (g.period === 'day' || (isLatest && day.status === 'awake')))
    .map((g) => goalProgress(g, lib.activities, sessions, start, end, now));

  const runningActivityId = running?.kind === 'activity' ? running.activityId : null;
  const tile = (a: Activity) => (
    <button
      key={a.id}
      className={`tile ${a.id === runningActivityId ? 'tile-active' : ''}`}
      style={{ ['--tile-color' as string]: lib.color(a), ['--tile-ink' as string]: lib.ink(a) }}
      onClick={() => startActivity(a.id)}
    >
      <span className="tile-emoji">{lib.emoji(a)}</span>
      <span className="tile-label">{lib.label(a)}</span>
    </button>
  );

  return (
    <div className="screen">
      {/* ‹ Day › */}
      <header className="day-nav">
        <button className="icon-btn big-arrow" onClick={() => setIndex(i - 1)} disabled={!viewDay || i === 0} aria-label="Previous day">
          ‹
        </button>
        <div className="day-nav-title">
          <div className="day-title">{label}</div>
          <div className="muted small">
            {!viewDay
              ? 'Since midnight. Days start when you wake up.'
              : `${formatDayTime(viewDay.start)} – ${viewDay.end ? formatDayTime(viewDay.end) : 'now'} · ${formatDuration(end - start)} awake`}
          </div>
          {isLatest && <StreakBadge streak={streak} />}
        </div>
        <button className="icon-btn big-arrow" onClick={() => setIndex(i + 1 >= latest ? null : i + 1)} disabled={isLatest} aria-label="Next day">
          ›
        </button>
      </header>
      {!isLatest && (
        <button className="link-btn center" onClick={() => setIndex(null)}>
          Back to today ›
        </button>
      )}

      {/* --- Live: only on the current day --- */}
      {isLatest && (
        <>
          {cloudEnabled && <LocalImportCard />}
          {showCheckIn && (
            <CheckInCard lib={lib} sessions={sessions} checkIn={checkIn} now={now} onSnooze={() => setSnoozeTick((t) => t + 1)} onSleepLogged={setClosingSleepId} />
          )}
          {showStillDoing && <StillDoingCard lib={lib} check={stillDoing} onDone={() => setSnoozeTick((t) => t + 1)} />}
          <OpenNowCard data={data} now={now} />
          {showRecover && (
            <section className="card recover">
              <p>
                {recover.review ? (
                  <>
                    <strong>{labelFor(recover.start)} is closed out, but less than half is filled in.</strong> Fill in{' '}
                    {formatDuration(moreNeededMs(recover, now))} more {streak.count > 0 ? `to keep your ${streak.count}-day streak.` : 'to count it toward a streak.'}
                  </>
                ) : (
                  <>
                    <strong>{labelFor(recover.start)} isn't closed out yet.</strong>{' '}
                    {streak.count > 0 ? `Close it out to keep your ${streak.count}-day streak.` : 'Close it out to start a streak.'}
                  </>
                )}
                {streak.recoverable.length > 1 && <span className="muted"> ({streak.recoverable.length} days to finish)</span>}
              </p>
              <button className="btn primary" onClick={() => setReview({ kind: 'close', day: recover, label: labelFor(recover.start), initialStep: 'timeline' })}>
                {recover.review ? `Fill in ${labelFor(recover.start)}` : `Close out ${labelFor(recover.start)}`}
              </button>
            </section>
          )}
          {day.status === 'no-day' && !running && <FirstDayCard />}

          <NowCard lib={lib} running={running} now={now} lastEnded={lastEnded} onEditStart={() => setEditStart(true)} />

          {routine && active && running?.kind !== 'sleep' && (
            <section className="card routine-bar">
              <div className="grow">
                <div className="small muted">
                  {routine.emoji || '🔁'} {routine.name} · step {active.step + 1} of {routine.activityIds.length}
                </div>
                <div>
                  {active.step + 1 < routine.activityIds.length ? (
                    <>
                      Next: <strong>{lib.label(lib.activityById.get(routine.activityIds[active.step + 1]))}</strong>
                    </>
                  ) : (
                    <strong>Last step</strong>
                  )}
                </div>
              </div>
              <button className="btn" onClick={() => endRoutine(false)}>
                End
              </button>
              <button className="btn primary" onClick={() => (active.step + 1 < routine.activityIds.length ? goToRoutineStep(routine, active.step + 1) : endRoutine(true))}>
                {active.step + 1 < routine.activityIds.length ? 'Next ›' : 'Done ✓'}
              </button>
            </section>
          )}

          {running?.kind !== 'sleep' && (
            <>
              <ActivitySearch lib={lib} sessions={sessions} />
              <section>
                <h3 className="section-title">Your usual</h3>
                <div className="tiles">
                  {usual.map(tile)}
                  <button className="tile" style={{ ['--tile-color' as string]: 'var(--sleep)' }} onClick={() => startSleep('nap')}>
                    <span className="tile-emoji">💤</span>
                    <span className="tile-label">Nap</span>
                  </button>
                </div>
              </section>
              {data.routines.length > 0 && !routine && (
                <section>
                  <h3 className="section-title">Routines</h3>
                  <div className="tiles">
                    {data.routines.map((r) => (
                      <button key={r.id} className="tile" style={{ ['--tile-color' as string]: 'var(--accent)' }} onClick={() => goToRoutineStep(r, 0)}>
                        <span className="tile-emoji">{r.emoji || '🔁'}</span>
                        <span className="tile-label">{r.name}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}

      {/* --- Past day: is it closed out? --- */}
      {viewDay && viewDay.end !== null && !(showRecover && recover.start === viewDay.start) && (
        <CloseOutCard data={data} day={viewDay} label={label} now={now} onReview={setReview} />
      )}

      {/* --- Summary, goals, sleep --- */}
      <DaySummary lib={lib} sessions={sessions} start={start} end={end} />
      {goalBars.length > 0 && (
        <section className="card">
          <GoalBars lib={lib} progress={goalBars} />
        </section>
      )}
      {isLatest && running?.kind !== 'sleep' && <SleepCard data={data} now={now} />}

      {/* --- Diary --- */}
      <Diary
        lib={lib}
        sessions={sessions}
        start={start}
        end={end}
        onEditSession={(s) => setEditing({ session: s })}
        onFillGap={(g) => setEditing({ draft: g })}
        onAdd={(range) => setEditing({ draft: range })}
      />

      {/* --- To do today (+ Later) --- */}
      {isLatest && <TodoList data={data} dayStart={start} now={now} />}

      {/* --- Complete the day (like MyFitnessPal's "Complete diary") --- */}
      {isLatest && day.status === 'awake' && (
        <>
          <button className="btn big primary" onClick={() => openQuick('goodnight')}>
            🌙 Complete today
            <small>Review the day, then go to sleep</small>
          </button>
          <button className="link-btn center" onClick={() => openQuick('logSleep')}>
            ☀️ Just woke up? Log the sleep you missed
          </button>
        </>
      )}
      {viewDay && viewDay.end !== null && !viewDay.review && (
        <button className="btn big primary" onClick={() => setReview({ kind: 'close', day: viewDay, label })}>
          Close out {label}
        </button>
      )}

      {editing && <SessionEditor lib={lib} sessions={sessions} session={editing.session} draft={editing.draft} onClose={() => setEditing(null)} />}
      {editStart && running && <StartTimeEditor lib={lib} session={running} sessions={sessions} onClose={() => setEditStart(false)} />}
      {review && <ReviewFlow lib={lib} sessions={sessions} mode={review} onClose={() => setReview(null)} />}
      {dayToClose && !dayToClose.review && (
        <ReviewFlow lib={lib} sessions={sessions} mode={{ kind: 'close', day: dayToClose, label: labelFor(dayToClose.start) }} onClose={() => setClosingSleepId(null)} />
      )}
    </div>
  );
}

/** What's running right now (or sleeping, or nothing). */
function NowCard({
  lib,
  running,
  now,
  lastEnded,
  onEditStart,
}: {
  lib: AppData['lib'];
  running: Session | undefined;
  now: number;
  lastEnded: number;
  onEditStart: () => void;
}) {
  if (running?.kind === 'sleep') {
    return (
      <section className="card now-card sleeping">
        <div className="now-label">{running.sleepType === 'nap' ? '💤 Napping' : '🌙 Sleeping'}</div>
        <div className="now-clock">{formatClock(now - running.start)}</div>
        {running.sleepType === 'nap' && <div className="muted small">Short naps (10–20 min) tend to leave you less groggy.</div>}
        <button className="since-btn" onClick={onEditStart}>
          since {formatDayTime(running.start)} <span className="since-edit">· change</span>
        </button>
        <button className="btn big primary" onClick={() => wakeUp()}>
          {running.sleepType === 'nap' ? "I'm up" : 'Good morning ☀️'}
        </button>
      </section>
    );
  }
  if (running) {
    return (
      <section className="card now-card" style={{ ['--tile-color' as string]: lib.sessionColor(running) }}>
        <div className="now-label">
          {lib.sessionEmoji(running)} {lib.sessionLabel(running)}
        </div>
        <div className="now-clock">{formatClock(now - running.start)}</div>
        <button className="since-btn" onClick={onEditStart}>
          since {formatDayTime(running.start)} <span className="since-edit">· change</span>
        </button>
        <button className="btn" onClick={() => stopRunning()}>
          Stop
        </button>
      </section>
    );
  }
  return (
    <section className="card now-card idle">
      <div className="now-label">Nothing running</div>
      {lastEnded > 0 && <div className="muted">Untracked for {formatDuration(now - lastEnded)}</div>}
      <div className="muted">Type what you're doing, or tap one below.</div>
    </section>
  );
}

/** For a finished day: closed out (with mood/energy/note), or not yet. */
function CloseOutCard({ data, day, label, now, onReview }: { data: AppData; day: Day; label: string; now: number; onReview: (m: ReviewMode) => void }) {
  const end = day.end!;
  if (day.review) {
    return (
      <section className="card">
        <div className="review-row">
          <span>
            ✓ Closed out
            {!countsForStreak(day) && (
              <span className="muted small">
                {day.review.closedAt > end + RECOVERY_WINDOW_MS
                  ? ' (after the 2-day window, so not part of the streak)'
                  : now <= end + RECOVERY_WINDOW_MS
                    ? ` · fill in ${formatDuration(moreNeededMs(day, now))} more to count it toward your streak`
                    : ' (less than half filled in, so not part of the streak)'}
              </span>
            )}
          </span>
          <button className="link-btn" onClick={() => onReview({ kind: 'close', day, label })}>
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
      </section>
    );
  }
  return (
    <section className="card recover">
      <p>
        <strong>Not closed out yet.</strong>{' '}
        {data.streak.frozen.has(day.start) && <>A streak freeze 🧊 covered it, so your streak kept going. </>}
        {now <= end + RECOVERY_WINDOW_MS
          ? moreNeededMs(day, now) > 0
            ? `Close it out and fill in ${formatDuration(moreNeededMs(day, now))} more (tap the gaps below) to count it toward your streak.`
            : 'Close it out to count it toward your streak.'
          : "It's past the 2-day window for the streak, but you can still close it for your own records."}
      </p>
    </section>
  );
}

function StreakBadge({ streak }: { streak: StreakInfo }) {
  if (streak.count === 0) return null;
  return (
    <span className="streak" title="Days in a row you closed out. 🧊 = streak freezes saved (one per 7 days in a row).">
      ☀️ {streak.count}-day streak
      {streak.freezes > 0 && <span className="freeze"> · 🧊{streak.freezes > 1 ? ` ${streak.freezes}` : ''}</span>}
    </span>
  );
}

/** Shown before any sleep is logged: your day starts when you wake up, so let's find out when that was. */
function FirstDayCard() {
  const [open, setOpen] = useState(false);
  const defaults = useMemo(() => {
    const wake = new Date();
    wake.setHours(8, 0, 0, 0);
    if (wake.getTime() > Date.now()) wake.setTime(Date.now());
    return { sleep: toLocalInput(wake.getTime() - 8 * 3600_000), wake: toLocalInput(wake.getTime()) };
  }, []);
  const [sleepAt, setSleepAt] = useState(defaults.sleep);
  const [wakeAt, setWakeAt] = useState(defaults.wake);
  const s = fromLocalInput(sleepAt);
  const w = fromLocalInput(wakeAt);
  const valid = s !== null && w !== null && w > s && w <= Date.now();

  return (
    <section className="card">
      <p>
        In Sundial, <strong>your day starts when you wake up</strong>, not at midnight. When did you last sleep?
      </p>
      {!open ? (
        <button className="btn primary" onClick={() => setOpen(true)}>
          Log last sleep
        </button>
      ) : (
        <>
          <label className="field">
            <span>Fell asleep</span>
            <input type="datetime-local" value={sleepAt} onChange={(e) => setSleepAt(e.target.value)} />
          </label>
          <label className="field">
            <span>Woke up</span>
            <input type="datetime-local" value={wakeAt} onChange={(e) => setWakeAt(e.target.value)} />
          </label>
          {!valid && <p className="form-error">Wake time should be after sleep time, and not in the future.</p>}
          <button className="btn primary" disabled={!valid} onClick={() => valid && logPastSleep(s!, w!)}>
            Start my day
          </button>
        </>
      )}
    </section>
  );
}
