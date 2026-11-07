// Export and restore your data (principle 10: your data is yours).
//  - JSON backup: everything, can be restored on any device.
//  - CSV: your time blocks as a spreadsheet (open in Numbers, Excel, Google Sheets).
import { db } from './db';
import { renameFixedIds } from './ids';
import type { Activity, Category, DayReview, Goal, Routine, Session, Settings } from './types';

export interface Backup {
  app: 'sundial';
  /** Backup format version, so future versions can still read old backups. */
  format: 1;
  exportedAt: number;
  categories: Category[];
  activities: Activity[];
  sessions: Session[];
  reviews: DayReview[];
  goals: Goal[];
  settings: Settings[];
  routines: Routine[];
}

export async function makeBackup(): Promise<Backup> {
  const [categories, activities, sessions, reviews, goals, settings, routines] = await Promise.all([
    db.categories.toArray(),
    db.activities.toArray(),
    db.sessions.toArray(),
    db.reviews.toArray(),
    db.goals.toArray(),
    db.settings.toArray(),
    db.routines.toArray(),
  ]);
  return { app: 'sundial', format: 1, exportedAt: Date.now(), categories, activities, sessions, reviews, goals, settings, routines };
}

/** Checks a file really is a Sundial backup before we use it. Throws a friendly message if not. */
export function parseBackup(text: string): Backup {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("That file isn't a Sundial backup (it isn't valid JSON).");
  }
  const b = data as Partial<Backup>;
  if (!b || b.app !== 'sundial') throw new Error("That file isn't a Sundial backup.");
  if (b.format !== 1) throw new Error('This backup is from a newer version of Sundial. Update the app first.');
  for (const key of ['categories', 'activities', 'sessions', 'reviews'] as const) {
    if (!Array.isArray(b[key])) throw new Error(`This backup looks damaged (missing ${key}).`);
  }
  for (const s of b.sessions!) {
    if (typeof s.id !== 'string' || typeof s.start !== 'number' || (s.end !== null && typeof s.end !== 'number')) {
      throw new Error('This backup looks damaged (a time block is broken).');
    }
  }
  // Older backups used fixed ids without "#"; rename them so they fit this version.
  return renameFixedIds({ goals: [], settings: [], routines: [], ...b } as Backup);
}

/** Replaces everything on this device with the backup. */
export async function restoreBackup(b: Backup) {
  await db.transaction('rw', [db.categories, db.activities, db.sessions, db.reviews, db.goals, db.settings, db.routines], async () => {
    await Promise.all([db.categories.clear(), db.activities.clear(), db.sessions.clear(), db.reviews.clear(), db.goals.clear(), db.settings.clear(), db.routines.clear()]);
    await db.categories.bulkAdd(b.categories);
    await db.activities.bulkAdd(b.activities);
    await db.sessions.bulkAdd(b.sessions);
    await db.reviews.bulkAdd(b.reviews);
    await db.goals.bulkAdd(b.goals);
    await db.settings.bulkAdd(b.settings);
    await db.routines.bulkAdd(b.routines);
  });
}

/** One row per block of time. */
export function sessionsToCsv(b: Pick<Backup, 'sessions' | 'activities' | 'categories'>, now = Date.now()): string {
  const acts = new Map(b.activities.map((a) => [a.id, a]));
  const cats = new Map(b.categories.map((c) => [c.id, c]));
  const iso = (ms: number) => {
    const d = new Date(ms);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };
  const cell = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [['start', 'end', 'minutes', 'what', 'parent activity', 'category', 'type', 'note']];
  for (const s of [...b.sessions].sort((x, y) => x.start - y.start)) {
    const end = s.end ?? now;
    const a = s.activityId ? acts.get(s.activityId) : undefined;
    const parent = a?.parentId ? acts.get(a.parentId) : undefined;
    rows.push([
      iso(s.start),
      s.end === null ? '(running)' : iso(end),
      String(Math.round((end - s.start) / 60000)),
      s.kind === 'sleep' ? (s.sleepType === 'nap' ? 'Nap' : 'Sleep') : (a?.name ?? 'Deleted activity'),
      parent?.name ?? '',
      s.kind === 'sleep' ? 'Sleep' : a?.categoryId ? (cats.get(a.categoryId)?.name ?? '') : 'Uncategorized',
      s.kind === 'sleep' ? (s.sleepType ?? 'main') : 'activity',
      s.note ?? '',
    ]);
  }
  return rows.map((r) => r.map(cell).join(',')).join('\n');
}

/**
 * Saves a file. On iPhone, the share sheet is the most reliable way (→ "Save to Files"),
 * especially when installed to the home screen. Elsewhere, a normal download.
 */
export async function saveFile(name: string, contents: string, type: string) {
  const file = new File([contents], name, { type });
  const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return; // you closed the share sheet
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Remembers when you last backed up, to gently remind you. */
export function lastBackupAt(): number | null {
  try {
    const v = localStorage.getItem('sundial.lastBackup');
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}
export function markBackedUp() {
  try {
    localStorage.setItem('sundial.lastBackup', String(Date.now()));
  } catch {
    /* ignore */
  }
}
