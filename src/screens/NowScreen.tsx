// The home screen: what's running now, one-tap buttons to switch, and sleep/wake.
import { useMemo, useState } from 'react';
import { logPastSleep, quickAddAndStart, startActivity, startSleep, stopRunning, wakeUp } from '../actions';
import { activityGroups } from '../components/ActivityPicker';
import { Sheet } from '../components/Sheet';
import type { DayState } from '../day';
import { formatClock, formatDayTime, formatDuration, fromLocalInput, toLocalInput } from '../format';
import { useNow, type Library } from '../hooks';
import type { Activity, Session } from '../types';

const MAX_RECENTS = 6;

export function NowScreen({ lib, sessions, day }: { lib: Library; sessions: Session[]; day: DayState }) {
  const now = useNow(1000);
  const [sleepChoice, setSleepChoice] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [quick, setQuick] = useState('');

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

  const runningActivityId = running?.kind === 'activity' ? running.activityId : null;
  const tile = (a: Activity) => (
    <button
      key={a.id}
      className={`tile ${a.id === runningActivityId ? 'tile-active' : ''}`}
      style={{ ['--tile-color' as string]: lib.color(a) }}
      onClick={() => startActivity(a.id)}
    >
      <span className="tile-emoji">{lib.emoji(a)}</span>
      <span className="tile-label">{lib.label(a)}</span>
    </button>
  );

  return (
    <div className="screen">
      <DayHeader day={day} now={now} />

      {day.status === 'no-day' && !running && <FirstDayCard />}

      {/* What's happening right now */}
      {running?.kind === 'sleep' ? (
        <section className="card now-card sleeping">
          <div className="now-label">{running.sleepType === 'nap' ? '💤 Napping' : '🌙 Sleeping'}</div>
          <div className="now-clock">{formatClock(now - running.start)}</div>
          <div className="muted">since {formatDayTime(running.start)}</div>
          <button className="btn big primary" onClick={wakeUp}>
            {running.sleepType === 'nap' ? "I'm up" : 'Good morning ☀️'}
          </button>
        </section>
      ) : running ? (
        <section className="card now-card" style={{ ['--tile-color' as string]: lib.sessionColor(running) }}>
          <div className="now-label">
            {lib.sessionEmoji(running)} {lib.sessionLabel(running)}
          </div>
          <div className="now-clock">{formatClock(now - running.start)}</div>
          <div className="muted">since {formatDayTime(running.start)}</div>
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

      {running?.kind !== 'sleep' && (
        <>
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
            <button className="btn sleep-btn" onClick={() => setSleepChoice(true)}>
              🌙 Going to sleep
            </button>
          </div>
        </>
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
              onClick={() => {
                startSleep('main');
                setSleepChoice(false);
              }}
            >
              🌙 Going to bed
              <small>Closes out today</small>
            </button>
          </div>
        </Sheet>
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

function DayHeader({ day, now }: { day: DayState; now: number }) {
  if (day.status === 'awake') {
    return (
      <header className="day-header">
        <div className="day-title">Your day</div>
        <div className="muted">
          Started {formatDayTime(day.start)} · awake {formatDuration(now - day.start)}
        </div>
      </header>
    );
  }
  if (day.status === 'asleep') {
    return (
      <header className="day-header">
        <div className="day-title">Good night</div>
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
