// To-do logic: open hours, due-date labels, and the optional iPhone Calendar file.
// (Sun Check 2026-11-07, "To-do list".) Wording stays neutral: "was due Tue", never "overdue!".
import type { Task, TaskWindow } from './types';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const minuteOf = (d: Date) => d.getHours() * 60 + d.getMinutes();

/** Is the window open at time `t`? (Handles windows that cross midnight, e.g. 10 PM–2 AM.) */
export function isOpen(w: TaskWindow, t: number): boolean {
  const d = new Date(t);
  const m = minuteOf(d);
  if (w.start <= w.end) return w.days.includes(d.getDay()) && m >= w.start && m < w.end;
  // Crosses midnight: open late on a listed day, or early the morning after a listed day.
  const yesterday = (d.getDay() + 6) % 7;
  return (w.days.includes(d.getDay()) && m >= w.start) || (w.days.includes(yesterday) && m < w.end);
}

/** When the window next opens after `t` (within the next 8 days), or null if it never does. */
export function nextOpening(w: TaskWindow, t: number): number | null {
  for (let i = 0; i <= 8; i++) {
    const d = new Date(t);
    d.setDate(d.getDate() + i);
    d.setHours(Math.floor(w.start / 60), w.start % 60, 0, 0);
    if (w.days.includes(d.getDay()) && d.getTime() > t) return d.getTime();
  }
  return null;
}

/** When the currently-open window closes. */
export function closesAt(w: TaskWindow, t: number): number {
  const d = new Date(t);
  if (w.start > w.end && minuteOf(d) >= w.start) d.setDate(d.getDate() + 1);
  d.setHours(Math.floor(w.end / 60), w.end % 60, 0, 0);
  return d.getTime();
}

export function formatMinutes(m: number): string {
  const d = new Date(2000, 0, 1, Math.floor(m / 60), m % 60);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: m % 60 ? '2-digit' : undefined });
}

/** "Mon–Fri", "Every day", "Weekends", "Mon, Wed, Fri". */
export function describeDays(days: number[]): string {
  const set = [...new Set(days)].sort((a, b) => a - b);
  if (set.length === 7) return 'Every day';
  if (set.join() === '1,2,3,4,5') return 'Mon–Fri';
  if (set.join() === '0,6') return 'Weekends';
  return set.map((d) => DAY_NAMES[d]).join(', ');
}

export const describeWindow = (w: TaskWindow) => `${describeDays(w.days)} ${formatMinutes(w.start)}–${formatMinutes(w.end)}`;

/** "open now · until 5 PM", "opens 9 AM", "opens Mon 9 AM". */
export function windowStatus(w: TaskWindow, t: number): { open: boolean; text: string } {
  if (isOpen(w, t)) return { open: true, text: `open now · until ${formatMinutes(minuteOf(new Date(closesAt(w, t))))}` };
  const next = nextOpening(w, t);
  if (next === null) return { open: false, text: describeWindow(w) };
  const n = new Date(next);
  const sameDay = n.toDateString() === new Date(t).toDateString();
  return { open: false, text: `opens ${sameDay ? '' : `${DAY_NAMES[n.getDay()]} `}${formatMinutes(minuteOf(n))}` };
}

/** "YYYY-MM-DD" for a local date. */
export function dateKey(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Local midnight of a "YYYY-MM-DD" date. */
export function fromDateKey(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

/** Calendar days from today until the due date (0 = today, negative = it's passed). */
export function daysUntil(due: string, t: number): number {
  const today = new Date(t);
  today.setHours(0, 0, 0, 0);
  return Math.round((fromDateKey(due) - today.getTime()) / 86_400_000);
}

/** "due today", "due tomorrow", "due Fri", "due Dec 1", "was due Tue". Plain facts, no alarm. */
export function dueLabel(due: string, t: number): string {
  const n = daysUntil(due, t);
  const d = new Date(fromDateKey(due));
  const name = Math.abs(n) < 7 ? DAY_NAMES[d.getDay()] : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  if (n === 0) return 'due today';
  if (n === 1) return 'due tomorrow';
  if (n === -1) return 'was due yesterday';
  return n > 0 ? `due ${name}` : `was due ${name}`;
}

/** Later list order: by due date (soonest first), then undated ones by when they were added. */
export function sortLater(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.due && b.due) return a.due.localeCompare(b.due);
    if (a.due) return -1;
    if (b.due) return 1;
    return a.createdAt - b.createdAt;
  });
}

/** Tasks to show on Today: undone ones on today's list, plus ones checked off since `dayStart`. */
export function todayTasks(tasks: Task[], dayStart: number): Task[] {
  return tasks
    .filter((x) => x.list === 'today' && (!x.doneAt || x.doneAt >= dayStart))
    .sort((a, b) => Number(!!a.doneAt) - Number(!!b.doneAt) || a.createdAt - b.createdAt);
}

/** Undone tasks whose hours are open right now (for the "open now" card). */
export function openNow(tasks: Task[], t: number): Task[] {
  return tasks.filter((x) => !x.doneAt && x.window && isOpen(x.window, t));
}

/** Default goodnight choice for each unfinished task: Tomorrow if it's the only one, else Later (no pile-ups). */
export function defaultCarry(unfinished: Task[]): 'today' | 'later' {
  return unfinished.length <= 1 ? 'today' : 'later';
}

// ---------------------------------------------------------------------------
// iPhone Calendar (.ics) — optional, off by default in settings
// ---------------------------------------------------------------------------

const icsDate = (t: number) => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/**
 * A calendar event for a task, so iPhone Calendar can send the reminder (no server needed).
 * Hours → the next time they open (30 min). Due date only → 9 AM on the due date. Neither → tomorrow 9 AM.
 */
export function taskToIcs(task: Task, now: number): string {
  let start: number;
  if (task.window) start = nextOpening(task.window, now) ?? now + 3_600_000;
  else if (task.due) start = fromDateKey(task.due) + 9 * 3_600_000;
  else {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    start = d.getTime();
  }
  const end = start + 30 * 60_000;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sundial//Tasks//EN',
    'BEGIN:VEVENT',
    `UID:${task.id}@sundial`,
    `DTSTAMP:${icsDate(now)}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(task.title)}`,
    ...(task.notes ? [`DESCRIPTION:${icsText(task.notes)}`] : []),
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsText(task.title)}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
