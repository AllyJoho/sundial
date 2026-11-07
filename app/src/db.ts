// The on-device database (IndexedDB), using the Dexie library to make it easier to work with.
// Everything lives on your phone. Nothing is sent anywhere.
import Dexie, { type Table } from 'dexie';
import type { Activity, Category, Session } from './types';

class SundialDB extends Dexie {
  categories!: Table<Category, string>;
  activities!: Table<Activity, string>;
  sessions!: Table<Session, string>;

  constructor() {
    super('sundial');
    // The strings list which fields can be searched quickly ("indexes").
    this.version(1).stores({
      categories: 'id, order',
      activities: 'id, categoryId, parentId',
      sessions: 'id, start, activityId',
    });
    // First launch: add a few starter categories and activities. All of them can be renamed or archived.
    this.on('populate', (tx) => {
      const cats: Category[] = [
        { id: 'cat-school', name: 'School', color: '#4f7cac', emoji: '📚', order: 0, archived: false },
        { id: 'cat-life', name: 'Life', color: '#5f9e6e', emoji: '🏠', order: 1, archived: false },
        { id: 'cat-leisure', name: 'Leisure', color: '#c0794b', emoji: '🎮', order: 2, archived: false },
        { id: 'cat-screens', name: 'Scrolling & screens', color: '#9a7bb5', emoji: '📱', order: 3, archived: false },
      ];
      const now = Date.now();
      const a = (id: string, name: string, categoryId: string, emoji: string, favorite = true): Activity => ({
        id, name, categoryId, parentId: null, emoji, favorite, archived: false, createdAt: now,
      });
      const acts: Activity[] = [
        a('act-class', 'Class', 'cat-school', '🏫'),
        a('act-homework', 'Homework', 'cat-school', '✏️'),
        a('act-eating', 'Eating', 'cat-life', '🍽️'),
        a('act-getting-ready', 'Getting ready', 'cat-life', '🪥'),
        a('act-gaming', 'Gaming', 'cat-leisure', '🎮'),
        a('act-scrolling', 'Scrolling', 'cat-screens', '📱'),
      ];
      tx.table('categories').bulkAdd(cats);
      tx.table('activities').bulkAdd(acts);
    });
  }
}

export const db = new SundialDB();

/** Ask the browser not to clear our data when the phone is low on storage. */
export function requestPersistentStorage() {
  navigator.storage?.persist?.().catch(() => {});
}
