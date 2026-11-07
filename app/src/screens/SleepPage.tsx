// Sleep mode, sleep goals, and your recent sleep. Consistency first, earlier second (features.md section 7).
import type { AppData } from '../App';
import { saveSettings } from '../actions';
import { formatDuration, formatTime } from '../format';
import {
  averageClockTime,
  formatClockMinutes,
  inSleepRange,
  recentWakeTimes,
  sleepDebt,
  sleepNights,
  targetWake,
  totalSleep,
  wakeSpread,
} from '../goals';
import type { SleepMode } from '../types';

const MODES: { id: SleepMode; title: string; body: string }[] = [
  { id: 'track', title: 'Just track', body: 'No sleep goals, just your data.' },
  { id: 'stabilize', title: 'Stabilize', body: 'Wake up around the same time every day, whatever that time is.' },
  { id: 'shift', title: 'Shift', body: 'Move your wake time a little earlier each week, starting from where you are now.' },
];

const toTimeInput = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const fromTimeInput = (v: string) => {
  const [h, m] = v.split(':').map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};

export function SleepPage({ data }: { data: AppData }) {
  const { settings, days, sessions } = data;
  const now = Date.now();
  const nights = sleepNights(sessions, days, now);
  const usualWake = averageClockTime(recentWakeTimes(days));
  const target = targetWake(settings, days, now);
  const spread = wakeSpread(days);
  const enoughData = days.length >= 3;

  function chooseMode(mode: SleepMode) {
    if (mode === 'shift' && settings.sleepMode !== 'shift') {
      // Start shifting from your real average wake time.
      const start = usualWake ?? 9 * 60;
      saveSettings({ sleepMode: mode, shiftStartedAt: Date.now(), shiftStartWake: start, shiftGoalWake: settings.shiftGoalWake ?? Math.max(0, start - 120) });
    } else saveSettings({ sleepMode: mode });
  }

  return (
    <>
      <section className="card">
        <h3 className="card-title">Sleep mode</h3>
        <div className="mode-list">
          {MODES.map((m) => (
            <button key={m.id} className={`mode ${settings.sleepMode === m.id ? 'on' : ''}`} onClick={() => chooseMode(m.id)}>
              <strong>{m.title}</strong>
              <span className="muted small">{m.body}</span>
            </button>
          ))}
        </div>
        {settings.sleepMode !== 'track' && !enoughData && (
          <p className="muted small">Track a few more wake-ups (3+) so Sundial can find your usual wake time.</p>
        )}
        {settings.sleepMode === 'stabilize' && target !== null && (
          <p>
            Target: wake around <strong>{formatClockMinutes(target)}</strong> (your usual), within{' '}
            <WindowSelect value={settings.wakeWindowMinutes} />.
          </p>
        )}
        {settings.sleepMode === 'shift' && target !== null && (
          <>
            <p>
              This week: wake by <strong>{formatClockMinutes(target)}</strong>, within <WindowSelect value={settings.wakeWindowMinutes} />.
              Started from {formatClockMinutes(settings.shiftStartWake!)} on {new Date(settings.shiftStartedAt!).toLocaleDateString()}.
            </p>
            <div className="field-row">
              <label className="field grow">
                <span>Earlier each week by</span>
                <select value={settings.shiftMinutesPerWeek} onChange={(e) => saveSettings({ shiftMinutesPerWeek: Number(e.target.value) })}>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                </select>
              </label>
              <label className="field grow">
                <span>Stop at</span>
                <input
                  type="time"
                  value={toTimeInput(settings.shiftGoalWake ?? 480)}
                  onChange={(e) => {
                    const m = fromTimeInput(e.target.value);
                    if (m !== null) saveSettings({ shiftGoalWake: m });
                  }}
                />
              </label>
            </div>
          </>
        )}
      </section>

      <section className="card">
        <h3 className="card-title">Sleep goal</h3>
        <div className="field-row">
          <label className="field grow">
            <span>At least</span>
            <select value={settings.sleepHoursMin} onChange={(e) => saveSettings({ sleepHoursMin: Number(e.target.value) })}>
              {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((h) => (
                <option key={h} value={h}>
                  {h}h
                </option>
              ))}
            </select>
          </label>
          <label className="field grow">
            <span>At most</span>
            <select value={settings.sleepHoursMax} onChange={(e) => saveSettings({ sleepHoursMax: Number(e.target.value) })}>
              {[7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12].map((h) => (
                <option key={h} value={h}>
                  {h}h
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="check">
          <input type="checkbox" checked={settings.napsCount} onChange={(e) => saveSettings({ napsCount: e.target.checked })} />
          Naps count toward total sleep
        </label>
      </section>

      <section className="card">
        <h3 className="card-title">Lately</h3>
        {nights.length === 0 ? (
          <p className="muted">No sleep logged yet.</p>
        ) : (
          <>
            <ul className="stat-list">
              {usualWake !== null && (
                <li>
                  <span>Usual wake time</span>
                  <strong>{formatClockMinutes(usualWake)}</strong>
                </li>
              )}
              {spread !== null && (
                <li>
                  <span>Wake time varies by about</span>
                  <strong>±{formatDuration(spread * 60_000)}</strong>
                </li>
              )}
              <li>
                <span>Short on sleep, last 7 nights</span>
                <strong>{formatDuration(sleepDebt(nights, settings))}</strong>
              </li>
            </ul>
            <ul className="night-list">
              {nights
                .slice(-7)
                .reverse()
                .map((n) => {
                  const t = totalSleep(n, settings);
                  return (
                    <li key={n.wake}>
                      <span className="grow">
                        {new Date(n.wake).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        <span className="muted small">
                          {' '}
                          {formatTime(n.bed)} – {formatTime(n.wake)}
                        </span>
                      </span>
                      <span>
                        {formatDuration(t)} {inSleepRange(t, settings) ? '✓' : ''}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

function WindowSelect({ value }: { value: number }) {
  return (
    <select className="inline-select" value={value} onChange={(e) => saveSettings({ wakeWindowMinutes: Number(e.target.value) })}>
      {[30, 45, 60, 90, 120].map((m) => (
        <option key={m} value={m}>
          ±{formatDuration(m * 60_000)}
        </option>
      ))}
    </select>
  );
}
