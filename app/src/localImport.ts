// When sync is turned on, Sundial uses a new synced database. Anything you tracked on this device
// before that is still in the old local database, untouched. This lets you choose to copy it in.
//
// It's a choice (not automatic) on purpose: if your phone has your real data and your computer only has
// test data, you'd upload from the phone and skip on the computer.
import Dexie from 'dexie';
import { cloudEnabled } from './cloud';
import { db, LOCAL_DB_NAME } from './db';
import { renameFixedIds, type DataBundle } from './ids';

const FLAG = 'sundial.localImport';
const TABLES = ['categories', 'activities', 'sessions', 'reviews', 'goals', 'settings', 'routines'] as const;

export type ImportChoice = 'uploaded' | 'skipped';

export function importDecision(): ImportChoice | null {
  try {
    return (localStorage.getItem(FLAG) as ImportChoice | null) ?? null;
  } catch {
    return null;
  }
}

function remember(choice: ImportChoice) {
  try {
    localStorage.setItem(FLAG, choice);
  } catch {
    /* storage unavailable: we'll ask again next time, which is harmless */
  }
}

/** Reads this device's pre-sync data. Returns null if there's none worth offering (or sync is off). */
export async function readLocalOnlyData(): Promise<DataBundle | null> {
  if (!cloudEnabled || importDecision()) return null;
  if (!(await Dexie.exists(LOCAL_DB_NAME))) return null;
  // Open the old database as it is, without declaring its layout ("dynamic mode").
  const old = new Dexie(LOCAL_DB_NAME);
  try {
    await old.open();
    const names = new Set(old.tables.map((t) => t.name));
    const read = async (n: (typeof TABLES)[number]) => (names.has(n) ? await old.table(n).toArray() : []);
    const raw = Object.fromEntries(await Promise.all(TABLES.map(async (n) => [n, await read(n)]))) as unknown as DataBundle;
    if (raw.sessions.length === 0) return null; // nothing tracked yet: nothing to move
    return renameFixedIds(raw);
  } finally {
    old.close();
  }
}

/** Copies the old data into the synced database (it uploads once you're signed in). */
export async function uploadLocalData(data: DataBundle) {
  await db.transaction('rw', [db.categories, db.activities, db.sessions, db.reviews, db.goals, db.settings, db.routines], async () => {
    for (const n of TABLES) await db.table(n).bulkPut(data[n] as object[]);
  });
  remember('uploaded');
}

/** Undo a "Don't copy" so the offer shows again. */
export function resetImportDecision() {
  try {
    localStorage.removeItem(FLAG);
  } catch {
    /* ignore */
  }
}

export function skipLocalData() {
  remember('skipped');
}
