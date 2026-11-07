// The on-device database (IndexedDB), using the Dexie library to make it easier to work with.
// Everything lives on your device. If sync is set up (see src/cloud.ts), Dexie Cloud also keeps
// a copy in your account so your phone and computer match. Without it, nothing is sent anywhere.
import Dexie, { type Table } from 'dexie';
import dexieCloud from 'dexie-cloud-addon';
import { CLOUD_URL } from './cloud';
import { renameFixedIds, type DataBundle } from './ids';
import { CATEGORY_COLORS, OLD_COLOR_TO_NEW } from './palette';
import type { Activity, Category, DayReview, Goal, Routine, Session, Settings } from './types';

/** The local-only database's name. (With sync on, Dexie Cloud uses its own database next to it.) */
export const LOCAL_DB_NAME = 'sundial';

/** "Downtime" is for rest and in-between time. Allowed and normal, never "wasted". */
export const DOWNTIME_ID = '#act-downtime';
function downtimeActivity(id = DOWNTIME_ID): Activity {
  return { id, name: 'Downtime', categoryId: null, parentId: null, emoji: '🛋️', favorite: false, archived: false, createdAt: Date.now() };
}

/** Sundial's first colors for the starter categories (used once, by the version 4 upgrade). */
const OLD_STARTER_COLORS: Record<string, [old: string, slot: number]> = {
  'cat-school': ['#4f7cac', 0],
  'cat-life': ['#5f9e6e', 1],
  'cat-leisure': ['#c0794b', 2],
  'cat-screens': ['#9a7bb5', 3],
};

class SundialDB extends Dexie {
  categories!: Table<Category, string>;
  activities!: Table<Activity, string>;
  sessions!: Table<Session, string>;
  reviews!: Table<DayReview, string>;
  goals!: Table<Goal, string>;
  settings!: Table<Settings, string>;
  routines!: Table<Routine, string>;

  constructor() {
    super(LOCAL_DB_NAME, { addons: CLOUD_URL ? [dexieCloud] : [] });
    // The strings list which fields can be searched quickly ("indexes").
    this.version(1).stores({
      categories: 'id, order',
      activities: 'id, categoryId, parentId',
      sessions: 'id, start, activityId',
    });
    // Version 2 (v2 features): end-of-day reviews, plus a built-in "Downtime" activity for gap fill.
    // Existing data is kept; this just adds to it. (Old-style id; version 6 renames it.)
    this.version(2)
      .stores({ reviews: 'id, sleepId' })
      .upgrade(async (tx) => {
        if (!(await tx.table('activities').get('act-downtime'))) await tx.table('activities').add(downtimeActivity('act-downtime'));
      });
    // Version 3 (v3 features): goals and settings (sleep mode etc.).
    this.version(3).stores({ goals: 'id', settings: 'id' });
    // Version 4: switch category colors to the tested palette (keeps each category's general hue).
    this.version(4)
      .stores({})
      .upgrade((tx) =>
        tx
          .table('categories')
          .toCollection()
          .modify((c: Category) => {
            const starter = OLD_STARTER_COLORS[c.id];
            if (starter && starter[0] === c.color) c.color = CATEGORY_COLORS[starter[1]];
            else if (OLD_COLOR_TO_NEW[c.color]) c.color = OLD_COLOR_TO_NEW[c.color];
          }),
      );
    // Version 5 (v5 features): routines.
    this.version(5).stores({ routines: 'id' });
    // Version 6: fixed ids get a "#" (see src/ids.ts), ready for sync.
    this.version(6)
      .stores({})
      .upgrade(async (tx) => {
        const names = ['categories', 'activities', 'sessions', 'reviews', 'goals', 'settings', 'routines'] as const;
        const before = Object.fromEntries(await Promise.all(names.map(async (n) => [n, await tx.table(n).toArray()]))) as unknown as DataBundle;
        const after = renameFixedIds(before);
        for (const n of names) {
          await tx.table(n).clear();
          await tx.table(n).bulkAdd(after[n] as object[]);
        }
      });

    // First launch: add a few starter categories and activities. All of them can be renamed or archived.
    // These use bulkAdd (insert only), so a new device can never overwrite your synced versions.
    this.on('populate', (tx) => {
      tx.table('categories').bulkAdd(starterCategories());
      tx.table('activities').bulkAdd(starterActivities());
    });

    if (CLOUD_URL) {
      this.cloud.configure({
        databaseUrl: CLOUD_URL,
        // The app works fully without signing in; signing in is optional (More → Account & sync).
        requireAuth: false,
        // We draw the email/code screens ourselves (src/components/LoginDialog.tsx).
        customLoginGui: true,
      });
    }
  }
}

export function starterCategories(): Category[] {
  return [
    { id: '#cat-school', name: 'School', color: CATEGORY_COLORS[0], emoji: '📚', order: 0, archived: false },
    { id: '#cat-life', name: 'Life', color: CATEGORY_COLORS[1], emoji: '🏠', order: 1, archived: false },
    { id: '#cat-leisure', name: 'Leisure', color: CATEGORY_COLORS[2], emoji: '🎮', order: 2, archived: false },
    { id: '#cat-screens', name: 'Scrolling & screens', color: CATEGORY_COLORS[3], emoji: '📱', order: 3, archived: false },
  ];
}

export function starterActivities(): Activity[] {
  const now = Date.now();
  const a = (id: string, name: string, categoryId: string, emoji: string): Activity => ({
    id, name, categoryId, parentId: null, emoji, favorite: true, archived: false, createdAt: now,
  });
  return [
    a('#act-class', 'Class', '#cat-school', '🏫'),
    a('#act-homework', 'Homework', '#cat-school', '✏️'),
    a('#act-eating', 'Eating', '#cat-life', '🍽️'),
    a('#act-getting-ready', 'Getting ready', '#cat-life', '🪥'),
    a('#act-gaming', 'Gaming', '#cat-leisure', '🎮'),
    a('#act-scrolling', 'Scrolling', '#cat-screens', '📱'),
    downtimeActivity(),
  ];
}

export const db = new SundialDB();

/** Ask the browser not to clear our data when the device is low on storage. */
export function requestPersistentStorage() {
  navigator.storage?.persist?.().catch(() => {});
}
