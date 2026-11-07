// The home screen: what's running now, one-tap buttons to switch, and sleep/wake.
import { useMemo, useState } from 'react';
import { endRoutine, goToRoutineStep, logPastSleep, quickAddAndStart, startActivity, startSleep, stopRunning, wakeUp } from '../actions';
import type { AppData } from '../App';
import { activityGroups } from '../components/ActivityPicker';
import { cloudEnabled } from '../cloud';
import { CheckInCard, checkInKey, isSnoozed } from '../components/CheckInCard';
import { LocalImportCard } from '../components/LocalImportCard';
import { GoalBars } from '../components/GoalBars';
import { LogPastSheet } from '../components/LogPastSheet';
import { StillDoingCard, stillDoingSnoozed } from '../components/StillDoingCard';
import { SleepCard } from '../components/SleepCard';
import { quickChoices, ReviewFlow, type ReviewMode } from '../components/ReviewFlow';
import { Sheet } from '../components/Sheet';
import { StartTimeEditor } from '../components/StartTimeEditor';
import type { DayState } from '../day';
import { detectCheckIn, type StreakInfo } from '../days';
import { goalProgress } from '../goals';
import { stillDoingCheck } from '../nudges';
import { dayLabel, formatClock, formatDayTime, formatDuration, fromLocalInput, toLocalInput } from '../format';
import { useNow } from '../hooks';
import type { Activity } from '../types';

const MAX_RECENTS = 6;

export function NowScreen({ data }: { data: AppData }) {
  const { lib, sessions, day, days, streak } = data;
  const now = useNow(1000);
  const [review, setReview] = useState<ReviewMode | null>(null);
  const [closingSleepId, setClosingSleepId] = useState<string | null>(null);
  const [, setSnoozeTick] = useState(0);
  const [sleepChoice, setSleepChoice] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [quick, setQuick] = useState('');
  const [editStart, setEditStart] = useState(false);
  const [logPast, setLogPast] = useState(false);

  const running = useMemo(() => sessions.find((s) => s.end === null), [sessions]);
  const lastEnded = useMemo(
    () => sessions.filter((s) => s.end !== null && s.end <= now).reduce((m, s) => Math.max(m, s.end!), 0),
    [sessions, now],
  );

  const favorites = lib.activities.filter((a) => a.favorite && !a.archived).sort((a, b) => lib.label(a).localeCompare(lib.label(b)));
  const recents = useMemo(() => {
    const seen = new Set<string>();
    const out: Activity[] = [];
    for (const s of [...sessions].sort((a, b) => b.start - a.start)) {
      if (s.kind !== 'activity' || !s.activityId || seen.has(s.activityId)) continue;
      seen.add(s.activityId);
      const a = lib.activityById.get(s.activityId);
      if (a && !a.archived && !a.favorite) out.push(a);
      if (out.length >= MAX_RECENTS) break;
    }
    return out;
  }, [sessions, lib]);

  // Check-ins ("Did you sleep?" / "Still asleep?"), re-checked once a minute.
  const minute = Math.floor(now / 60_000);
  const checkIn = useMemo(() => detectCheckIn(sessions, day, Date.now()), [sessions, day, minute]);
  const showCheckIn = checkIn && !isSnoozed(checkInKey(checkIn));
  const stillDoing = useMemo(() => stillDoingCheck(sessions, Date.now()), [sessions, minute]);
  const showStillDoing = !showCheckIn && stillDoing && !stillDoingSnoozed(stillDoing);

  // The routine you're in, if any (and it still exists).
  const active = data.settings.activeRoutine;
  const routine = active ? data.routines.find((r) => r.id === active.routineId) : undefined;

  const labelFor = (dayStart: number) => {
    const i = days.findIndex((d) => d.start === dayStart);
    return dayLabel(dayStart, days.length - 1 - i);
  };
  // After logging a missed sleep, close out the day it ended (once the new data has loaded).
  const dayToClose = closingSleepId ? days.find((d) => d.closingSleepId === closingSleepId) : undefined;
  const recover = streak.recoverable[0];

  // Goal progress for today (your sleep-based day) and this week.
  const goalBars =
    day.status === 'awake'
      ? data.goals.filter((g) => !g.archived).map((g) => goalProgress(g, lib.activities, sessions, day.start, now, now))
      : [];

  function goToBed() {
    setSleepChoice(false);
    if (day.status === 'awake') setReview({ kind: 'goodnight', dayStart: day.start, bedtime: Date.now() });
    else startSleep('main'); // no wake-up logged yet, so there's no day to review
  }

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
      <DayHeader day={day} now={now} streak={streak} />

      {cloudEnabled && <LocalImportCard />}

      {showCheckIn && (
        <CheckInCard
          lib={lib}
          sessions={sessions}
          checkIn={checkIn}
          now={now}
          onSnooze={() => setSnoozeTick((t) => t + 1)}
          onSleepLogged={setClosingSleepId}
        />
      )}

      {showStillDoing && <StillDoingCard lib={lib} check={stillDoing} onDone={() => setSnoozeTick((t) => t + 1)} />}

      {!showCheckIn && recover && running?.kind !== 'sleep' && (
        <section className="card recover">
          <p>
            <strong>{labelFor(recover.start)} isn't closed out yet.</strong>{' '}
            {streak.count > 0 ? `Close it out to keep your ${streak.count}-day streak.` : 'Close it out to start a streak.'}
            {streak.recoverable.length > 1 && <span className="muted"> ({streak.recoverable.length} days to close)</span>}
          </p>
          <button className="btn primary" onClick={() => setReview({ kind: 'close', day: recover, label: labelFor(recover.start) })}>
            Close out {labelFor(recover.start)}
          </button>
        </section>
      )}

      {day.status === 'no-day' && !running && <FirstDayCard />}

      {/* What's happening right now */}
      {running?.kind === 'sleep' ? (
        <section className="card now-card sleeping">
          <div className="now-label">{running.sleepType === 'nap' ? '💤 Napping' : '🌙 Sleeping'}</div>
          <div className="now-clock">{formatClock(now - running.start)}</div>
          <button className="since-btn" onClick={() => setEditStart(true)}>
            since {formatDayTime(running.start)} <span className="since-edit">· change</span>
          </button>
          <button className="btn big primary" onClick={() => wakeUp()}>
            {running.sleepType === 'nap' ? "I'm up" : 'Good morning ☀️'}
          </button>
        </section>
      ) : running ? (
        <section className="card now-card" style={{ ['--tile-color' as string]: lib.sessionColor(running) }}>
          <div className="now-label">
            {lib.sessionEmoji(running)} {lib.sessionLabel(running)}
          </div>
          <div className="now-clock">{formatClock(now - running.start)}</div>
          <button className="since-btn" onClick={() => setEditStart(true)}>
            since {formatDayTime(running.start)} <span className="since-edit">· change</span>
          </button>
          <button className="btn" onClick={() => stopRunning()}>
            Stop
          </button>
        </section>
      ) : (
        <section className="card now-card idle">
          <div className="now-label">Nothing running</div>
          {lastEnded > 0 && <div className="muted">Untracked for {formatDuration(now - lastEnded)}</div>}
          <div className="muted">Tap something below to start.</div>
        </section>
      )}

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
          {favorites.length > 0 && (
            <section>
              <h3 className="section-title">Favorites</h3>
              <div className="tiles">{favorites.map(tile)}</div>
            </section>
          )}
          {recents.length > 0 && (
            <section>
              <h3 className="section-title">Recent</h3>
              <div className="tiles">{recents.map(tile)}</div>
            </section>
          )}

          <form
            className="quick-add"
            onSubmit={(e) => {
              e.preventDefault();
              quickAddAndStart(quick);
              setQuick('');
            }}
          >
            <input value={quick} onChange={(e) => setQuick(e.target.value)} placeholder="Start something new…" enterKeyHint="go" />
            <button className="btn primary" disabled={!quick.trim()}>
              Start
            </button>
          </form>

          <div className="row-buttons">
            <button className="btn" onClick={() => setShowAll(true)}>
              All activities
            </button>
            <button className="btn" onClick={() => setLogPast(true)}>
              + Log past time
            </button>
          </div>
          <button className="btn sleep-btn" onClick={() => setSleepChoice(true)}>
            🌙 Going to sleep
          </button>
        </>
      )}

      {running?.kind !== 'sleep' && <SleepCard data={data} now={now} />}

      {goalBars.length > 0 && (
        <section>
          <h3 className="section-title">Goals</h3>
          <div className="card">
            <GoalBars lib={lib} progress={goalBars} />
          </div>
        </section>
      )}

      {editStart && running && (
        <StartTimeEditor lib={lib} session={running} sessions={sessions} onClose={() => setEditStart(false)} />
      )}

      {sleepChoice && (
        <Sheet title="Nap or going to bed?" onClose={() => setSleepChoice(false)}>
          <div className="choice-buttons">
            <button
              className="btn big"
              onClick={() => {
                startSleep('nap');
                setSleepChoice(false);
              }}
            >
              💤 Nap
              <small>Your day keeps going</small>
            </button>
            <button
              className="btn big primary"
              onClick={goToBed}
            >
              🌙 Going to bed
              <small>Closes out today</small>
            </button>
          </div>
        </Sheet>
      )}

      {logPast && <LogPastSheet lib={lib} sessions={sessions} choices={quickChoices(lib, sessions)} onClose={() => setLogPast(false)} />}
      {review && <ReviewFlow lib={lib} sessions={sessions} mode={review} onClose={() => setReview(null)} />}
      {dayToClose && !dayToClose.review && (
        <ReviewFlow
          lib={lib}
          sessions={sessions}
          mode={{ kind: 'close', day: dayToClose, label: labelFor(dayToClose.start) }}
          onClose={() => setClosingSleepId(null)}
        />
      )}

      {showAll && (
        <Sheet title="Start an activity" onClose={() => setShowAll(false)}>
          {activityGroups(lib).map((g) => (
            <div key={g.key} className="picker-group">
              <h3 className="section-title">{g.name}</h3>
              <div className="tiles">
                {g.activities.map((a) => (
                  <button
                    key={a.id}
                    className="tile"
                    style={{ ['--tile-color' as string]: lib.color(a) }}
                    onClick={() => {
                      startActivity(a.id);
                      setShowAll(false);
                    }}
                  >
                    <span className="tile-emoji">{lib.emoji(a)}</span>
                    <span className="tile-label">{lib.label(a)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </Sheet>
      )}
    </div>
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

function DayHeader({ day, now, streak }: { day: DayState; now: number; streak: StreakInfo }) {
  if (day.status === 'awake') {
    return (
      <header className="day-header">
        <div className="day-title-row">
          <div className="day-title">Your day</div>
          <StreakBadge streak={streak} />
        </div>
        <div className="muted">
          Started {formatDayTime(day.start)} · awake {formatDuration(now - day.start)}
        </div>
      </header>
    );
  }
  if (day.status === 'asleep') {
    return (
      <header className="day-header">
        <div className="day-title-row">
          <div className="day-title">Good night</div>
          <StreakBadge streak={streak} />
        </div>
        <div className="muted">Tap “Good morning” when you wake up to start a new day.</div>
      </header>
    );
  }
  return (
    <header className="day-header">
      <div className="day-title">Welcome to Sundial</div>
    </header>
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
