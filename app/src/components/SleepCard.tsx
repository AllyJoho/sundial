// Morning sleep summary on the home screen: last night's sleep and your wake time vs. your target.
// Compares you to yourself, never to "normal" (principles 4 and 5).
import type { AppData } from '../App';
import { formatDuration, formatTime } from '../format';
import {
  clockDistance,
  daysInWakeWindow,
  formatClockMinutes,
  inSleepRange,
  minuteOfDay,
  sleepNights,
  targetWake,
  totalSleep,
} from '../goals';

export function SleepCard({ data, now }: { data: AppData; now: number }) {
  const { settings, days, sessions, day } = data;
  if (day.status !== 'awake') return null;
  const nights = sleepNights(sessions, days, now);
  const night = nights[nights.length - 1];
  if (!night || night.day.start !== day.start) return null;

  const total = totalSleep(night, settings);
  const ranged = inSleepRange(total, settings);
  const target = targetWake(settings, days, now);
  const woke = minuteOfDay(night.wake);
  const window = target !== null ? daysInWakeWindow(days, target, settings.wakeWindowMinutes) : null;

  // Small wins: your best this week, or days in a row near your target.
  const lastWeek = nights.slice(-7);
  // Compared with your own last 7 nights (not counting last night).
  const before = nights.slice(-8, -1);
  const avgBefore = before.length >= 3 ? before.reduce((t, n) => t + totalSleep(n, settings), 0) / before.length : null;
  const diff = avgBefore === null ? 0 : total - avgBefore;
  const best = lastWeek.length >= 3 && lastWeek.every((n) => n === night || totalSleep(n, settings) <= total) && ranged;
  let streakNear = 0;
  if (target !== null) {
    for (let i = days.length - 1; i >= 0; i--) {
      if (clockDistance(minuteOfDay(days[i].start), target) <= settings.wakeWindowMinutes) streakNear++;
      else break;
    }
  }

  return (
    <section className="card sleep-card">
      <div className="sleep-row">
        <span className="sleep-big">🌙 {formatDuration(total)}</span>
        <span className="muted small">
          {formatTime(night.bed)} – {formatTime(night.wake)}
          {settings.napsCount && night.napMs > 0 ? ` + ${formatDuration(night.napMs)} nap` : ''}
        </span>
      </div>
      <p className="small" style={{ margin: '4px 0 0' }}>
        {ranged
          ? `✓ In your ${settings.sleepHoursMin}–${settings.sleepHoursMax}h range`
          : total < settings.sleepHoursMin * 3600_000
            ? `A bit under your ${settings.sleepHoursMin}h goal`
            : `A bit over your ${settings.sleepHoursMax}h range`}
        {best && ' · your best this week 🌱'}
        {avgBefore !== null && Math.abs(diff) >= 10 * 60_000 && (
          <span className="muted">
            {' '}
            · {diff > 0 ? '+' : '−'}
            {formatDuration(Math.abs(diff))} vs your 7-day average
          </span>
        )}
      </p>
      {target !== null && window && (
        <p className="small" style={{ margin: '4px 0 0' }}>
          Woke {formatClockMinutes(woke)} · target {formatClockMinutes(target)}
          {clockDistance(woke, target) <= settings.wakeWindowMinutes ? ' ✓' : ''} · {window.inWindow} of last {window.total} days near it
          {streakNear >= 3 && ` · ${streakNear} days in a row 🌱`}
        </p>
      )}
    </section>
  );
}
