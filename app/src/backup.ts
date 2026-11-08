// Export and restore your data (principle 10: your data is yours).
//  - JSON backup: everything, can be restored on any device.
//  - CSV: your time blocks as a spreadsheet (open in Numbers, Excel, Google Sheets).
import { db } from './db';
import { coveredWithin, mergeIntervals } from './days';
import { renameFixedIds } from './ids';
import type { Activity, Category, DayReview, Goal, Routine, Session, Settings, Task } from './types';

export interface Backup {
  app: 'sundial';
  /** Backup format version, so future versions can still read old backups. */
  format: 1;
  exportedAt: number;
  /** Which kind of device made it ("iPhone", "Mac"…), for the paste preview. */
  from?: string;
  categories: Category[];
  activities: Activity[];
  sessions: Session[];
  reviews: DayReview[];
  goals: Goal[];
  settings: Settings[];
  routines: Routine[];
  tasks: Task[];
}

export async function makeBackup(): Promise<Backup> {
  const [categories, activities, sessions, reviews, goals, settings, routines, tasks] = await Promise.all([
    db.categories.toArray(),
    db.activities.toArray(),
    db.sessions.toArray(),
    db.reviews.toArray(),
    db.goals.toArray(),
    db.settings.toArray(),
    db.routines.toArray(),
    db.tasks.toArray(),
  ]);
  return { app: 'sundial', format: 1, exportedAt: Date.now(), categories, activities, sessions, reviews, goals, settings, routines, tasks };
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
  return renameFixedIds({ goals: [], settings: [], routines: [], tasks: [], ...b } as Backup);
}

/** Replaces everything on this device with the backup. */
export async function restoreBackup(b: Backup) {
  await db.transaction('rw', [db.categories, db.activities, db.sessions, db.reviews, db.goals, db.settings, db.routines, db.tasks], async () => {
    await Promise.all([db.categories.clear(), db.activities.clear(), db.sessions.clear(), db.reviews.clear(), db.goals.clear(), db.settings.clear(), db.routines.clear(), db.tasks.clear()]);
    await db.categories.bulkAdd(b.categories);
    await db.activities.bulkAdd(b.activities);
    await db.sessions.bulkAdd(b.sessions);
    await db.reviews.bulkAdd(b.reviews);
    await db.goals.bulkAdd(b.goals);
    await db.settings.bulkAdd(b.settings);
    await db.routines.bulkAdd(b.routines);
    await db.tasks.bulkAdd(b.tasks);
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

// ---------------------------------------------------------------------------
// Copy / paste between devices (shared clipboard, e.g. Apple's Universal Clipboard)
// ---------------------------------------------------------------------------

/** A rough name for this device, shown when the save is pasted on the other one. */
export function deviceName(ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''): string {
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Android/.test(ua)) return 'Android phone';
  if (/Macintosh|Mac OS X/.test(ua)) return 'Mac';
  if (/Windows/.test(ua)) return 'Windows computer';
  return 'other device';
}

const PREFIX = 'SUNDIAL1:';

function toBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
function fromBase64(b64: string): Uint8Array {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

/** Turns a backup into one line of text to copy: compressed (several times smaller) when the browser can. */
export async function encodeTransfer(b: Backup): Promise<string> {
  const json = JSON.stringify(b);
  if (typeof CompressionStream === 'undefined') return json;
  const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
  return PREFIX + toBase64(new Uint8Array(await new Response(stream).arrayBuffer()));
}

/**
 * Reads pasted text (compressed or plain JSON) back into a checked backup. Throws a friendly message if it isn't one.
 * Forgiving on purpose: phones sometimes add line breaks or invisible characters to long pastes, and a paste can land
 * after old text in the box. So it looks for the LAST "SUNDIAL1:" anywhere and ignores everything that isn't data.
 */
export async function decodeTransfer(text: string): Promise<Backup> {
  // Remove whitespace and invisible characters (zero-width spaces, byte-order marks). Base64 never contains them.
  const squashed = text.replace(/[\s\u200B-\u200D\u2060\uFEFF]/g, '');
  const at = squashed.lastIndexOf(PREFIX);
  if (at >= 0) {
    const body = squashed.slice(at + PREFIX.length).match(/^[A-Za-z0-9+/=]+/)?.[0] ?? '';
    let json: string;
    try {
      const stream = new Blob([fromBase64(body)]).stream().pipeThrough(new DecompressionStream('gzip'));
      json = await new Response(stream).text();
    } catch {
      throw new Error("That doesn't look like a complete Sundial copy. Try copying again (part of it may have been cut off).");
    }
    return parseBackup(json);
  }
  // Plain backup JSON (from a backup file, or a browser without compression).
  const t = text.replace(/[\u200B-\u200D\u2060\uFEFF]/g, '');
  const open = t.indexOf('{');
  const close = t.lastIndexOf('}');
  if (open >= 0 && close > open) return parseBackup(t.slice(open, close + 1));
  throw new Error("That isn't Sundial data. On your other device, tap \"Copy my data\" first, then paste here.");
}

/**
 * Pasting a save from your other device (Sun Check decision, 2026-11-07): the pasted save wins.
 * The only things kept from this device are time blocks that fill time the pasted save has as untracked
 * (no overlap at all), plus the activities/categories those blocks need.
 */
export function mergeIncoming(local: Backup, incoming: Backup, now: number): { merged: Backup; rescued: Session[] } {
  const incomingIds = new Set(incoming.sessions.map((s) => s.id));
  const covered = mergeIntervals(incoming.sessions, now);
  const incomingRunning = incoming.sessions.some((s) => s.end === null);
  const rescued = local.sessions.filter(
    (s) =>
      !incomingIds.has(s.id) &&
      !(s.end === null && incomingRunning) && // only one live timer
      coveredWithin(covered, s.start, s.end ?? now) === 0,
  );

  // Bring along any activities (and their parents and categories) the rescued blocks need.
  const actIds = new Set(incoming.activities.map((a) => a.id));
  const catIds = new Set(incoming.categories.map((c) => c.id));
  const localActs = new Map(local.activities.map((a) => [a.id, a]));
  const extraActs: Activity[] = [];
  const need = (id: string | null | undefined) => {
    if (!id || actIds.has(id)) return;
    const a = localActs.get(id);
    if (!a) return;
    actIds.add(id);
    extraActs.push(a);
    need(a.parentId);
  };
  rescued.forEach((s) => need(s.activityId));
  const extraCats = local.categories.filter((c) => !catIds.has(c.id) && extraActs.some((a) => a.categoryId === c.id));

  return {
    merged: {
      ...incoming,
      sessions: [...incoming.sessions, ...rescued],
      activities: [...incoming.activities, ...extraActs],
      categories: [...incoming.categories, ...extraCats],
    },
    rescued,
  };
}

/**
 * Copies text to the clipboard. Uses the modern clipboard where allowed (https), and falls back to the
 * older select-and-copy trick, which also works on http:// (like testing over home Wi-Fi).
 * Must be called directly from a tap (iPhone only allows copying during the tap itself).
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall back below */
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '0';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}
