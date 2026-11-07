// Everything that changes data goes through these functions.
import { db } from './db';
import type { Activity, Category, Session, SleepType } from './types';

const newId = () => crypto.randomUUID();

/** The session that's currently running (no end time), if any. Only one runs at a time. */
export async function getRunning(): Promise<Session | undefined> {
  return db.sessions.orderBy('start').reverse().filter((s) => s.end === null).first();
}

/** Stops whatever is running. */
export async function stopRunning(at = Date.now()) {
  await db.transaction('rw', db.sessions, async () => {
    const running = await db.sessions.filter((s) => s.end === null).toArray();
    for (const s of running) await db.sessions.update(s.id, { end: Math.max(at, s.start) });
  });
}

/** Clock in to an activity. Whatever was running stops automatically. */
export async function startActivity(activityId: string) {
  const now = Date.now();
  await db.transaction('rw', db.sessions, async () => {
    const running = await getRunning();
    if (running?.kind === 'activity' && running.activityId === activityId) return; // already doing it
    await stopRunning(now);
    await db.sessions.add({ id: newId(), kind: 'activity', activityId, start: now, end: null, source: 'live' });
  });
}

/** Quick add: create a new uncategorized activity and start it right away. */
export async function quickAddAndStart(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const existing = await db.activities
    .filter((a) => !a.archived && a.name.toLowerCase() === trimmed.toLowerCase())
    .first();
  const id = existing?.id ?? (await createActivity({ name: trimmed, categoryId: null, parentId: null }));
  await startActivity(id);
}

export async function startSleep(sleepType: SleepType) {
  const now = Date.now();
  await db.transaction('rw', db.sessions, async () => {
    await stopRunning(now);
    await db.sessions.add({ id: newId(), kind: 'sleep', activityId: null, sleepType, start: now, end: null, source: 'live' });
  });
}

/** Ends the running sleep ("Good morning" / "I'm up"). */
export async function wakeUp() {
  const running = await getRunning();
  if (running?.kind === 'sleep') await db.sessions.update(running.id, { end: Date.now() });
}

/** For the very first day: log last night's sleep after the fact. */
export async function logPastSleep(start: number, end: number) {
  await db.sessions.add({ id: newId(), kind: 'sleep', activityId: null, sleepType: 'main', start, end, source: 'manual' });
}

export async function saveSession(session: Session) {
  await db.sessions.put(session);
}

export async function addSession(s: Omit<Session, 'id'>) {
  await db.sessions.add({ ...s, id: newId() });
}

export async function deleteSession(id: string) {
  await db.sessions.delete(id);
}

export async function createActivity(input: Pick<Activity, 'name' | 'categoryId' | 'parentId'> & Partial<Activity>) {
  const id = newId();
  await db.activities.add({ favorite: false, archived: false, createdAt: Date.now(), ...input, id });
  return id;
}

export async function updateActivity(id: string, changes: Partial<Activity>) {
  await db.activities.update(id, changes);
}

export async function createCategory(input: Pick<Category, 'name' | 'color'> & Partial<Category>) {
  const count = await db.categories.count();
  const id = newId();
  await db.categories.add({ order: count, archived: false, ...input, id });
  return id;
}

export async function updateCategory(id: string, changes: Partial<Category>) {
  await db.categories.update(id, changes);
}
