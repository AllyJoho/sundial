// Helpers for showing times and durations nicely.

export function formatDuration(ms: number): string {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Live timer style: 1:05:09 */
export function formatClock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

export function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/** "Thu 9:30 PM". Used when a time isn't today. */
export function formatDayTime(ms: number): string {
  const d = new Date(ms);
  const sameDay = d.toDateString() === new Date().toDateString();
  return sameDay ? formatTime(ms) : `${d.toLocaleDateString([], { weekday: 'short' })} ${formatTime(ms)}`;
}

/** Converts to the format an <input type="datetime-local"> expects. */
export function toLocalInput(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromLocalInput(value: string): number | null {
  if (!value) return null;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? null : t;
}

/**
 * A friendly name for a sleep-based day, counted back from the latest one:
 * the latest is "Today", the one before is "Yesterday", older ones get a date.
 */
export function dayLabel(dayStart: number, stepsBack: number): string {
  if (stepsBack === 0) return 'Today';
  if (stepsBack === 1) return 'Yesterday';
  const d = new Date(dayStart);
  const withinWeek = Date.now() - dayStart < 6 * 24 * 3600_000;
  return withinWeek
    ? d.toLocaleDateString([], { weekday: 'long' })
    : d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
