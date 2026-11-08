// The center "+" button's menu: log from any tab (Sun Check 2026-11-07, "Today and Plan").
// It also owns the logging flows the Today tab triggers (goodnight, log past time, "just woke up"),
// so each lives in exactly one place.
import { useState } from 'react';
import type { AppData } from '../App';
import { startActivity, startSleep } from '../actions';
import { dayLabel } from '../format';
import { activityGroups } from './ActivityPicker';
import { ActivitySearch } from './ActivitySearch';
import { MissedSleepSheet } from './CheckInCard';
import { LogPastSheet } from './LogPastSheet';
import { ReviewFlow } from './ReviewFlow';
import { Sheet } from './Sheet';

export type QuickAction = 'menu' | 'goodnight' | 'logPast' | 'logSleep' | 'all';

export function QuickLog({ data, action, setAction }: { data: AppData; action: QuickAction | null; setAction: (a: QuickAction | null) => void }) {
  const { lib, sessions, day, days } = data;
  // After logging a missed sleep, close out the day it ended (once the new data has loaded).
  const [closingSleepId, setClosingSleepId] = useState<string | null>(null);
  const [bedtime, setBedtime] = useState<number | null>(null);
  const close = () => setAction(null);
  const dayToClose = closingSleepId ? days.find((d) => d.closingSleepId === closingSleepId) : undefined;
  const labelFor = (start: number) => dayLabel(start, days.length - 1 - days.findIndex((d) => d.start === start));
  const running = sessions.find((s) => s.end === null);
  const lastEnded = sessions.filter((s) => s.end !== null && s.end <= Date.now()).reduce((m, s) => Math.max(m, s.end!), 0);

  function goodnight() {
    if (day.status === 'awake') {
      setBedtime(Date.now());
      setAction('goodnight');
    } else {
      startSleep('main'); // no wake-up logged yet, so there's no day to review
      close();
    }
  }

  return (
    <>
      {action === 'menu' && (
        <Sheet title="Log" onClose={close}>
          {running?.kind !== 'sleep' && <ActivitySearch lib={lib} sessions={sessions} onStarted={close} />}
          <div className="quick-grid">
            <button className="quick-btn" onClick={() => setAction('logPast')}>
              <span>⏪</span>Log past time
            </button>
            <button
              className="quick-btn"
              onClick={() => {
                startSleep('nap');
                close();
              }}
            >
              <span>💤</span>Nap
            </button>
            <button className="quick-btn" onClick={goodnight}>
              <span>🌙</span>Going to bed
            </button>
            <button className="quick-btn" onClick={() => setAction('logSleep')}>
              <span>☀️</span>Just woke up
            </button>
          </div>
          <button className="link-btn center" onClick={() => setAction('all')}>
            Browse all activities
          </button>
        </Sheet>
      )}

      {action === 'goodnight' && day.status === 'awake' && (
        <ReviewFlow lib={lib} sessions={sessions} tasks={data.tasks} mode={{ kind: 'goodnight', dayStart: day.start, bedtime: bedtime ?? Date.now() }} onClose={close} />
      )}

      {action === 'logPast' && <LogPastSheet lib={lib} sessions={sessions} onClose={close} />}

      {action === 'logSleep' && (
        <MissedSleepSheet
          lib={lib}
          sessions={sessions}
          // Guess you fell asleep when your last activity ended, if that was a while ago; otherwise about 8h ago.
          suggestStart={
            day.status !== 'awake'
              ? Date.now() - 8 * 3600_000
              : lastEnded > day.start && Date.now() - lastEnded >= 3 * 3600_000
                ? lastEnded
                : Math.max(day.start, Date.now() - 8 * 3600_000)
          }
          suggestEnd={Date.now()}
          onClose={close}
          onSaved={setClosingSleepId}
        />
      )}

      {dayToClose && !dayToClose.review && (
        <ReviewFlow
          lib={lib}
          sessions={sessions}
          mode={{ kind: 'close', day: dayToClose, label: labelFor(dayToClose.start) }}
          onClose={() => setClosingSleepId(null)}
        />
      )}

      {action === 'all' && (
        <Sheet title="Start an activity" onClose={close}>
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
                      close();
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
    </>
  );
}
