// Everything that changes data goes through these functions.
import { db } from './db';
import { planStartChange } from './day';
import { planInsert, type InsertPlan } from './days';
import { DEFAULT_SETTINGS, type Activity, type Category, type DayReview, type Goal, type Routine, type Session, type Settings, type SleepType } from './types';

/**
 * A unique id for each new thing we save.
 * crypto.randomUUID only exists on https:// (or localhost), so when testing on a phone over
 * home Wi-Fi (http://192.168…) we fall back to building one from random numbers.
 */
function newId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

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

/** Starts a sleep (stopping whatever was running). Returns the new sleep's id. */
export async function startSleep(sleepType: SleepType, at = Date.now()): Promise<string> {
  const id = newId();
  if ((await db.settings.get('#main'))?.activeRoutine) await saveSettings({ activeRoutine: undefined });
  await db.transaction('rw', db.sessions, async () => {
    await stopRunning(at);
    await db.sessions.add({ id, kind: 'sleep', activityId: null, sleepType, start: at, end: null, source: 'live' });
  });
  return id;
}

/** Ends the running sleep ("Good morning" / "I'm up"), now or at a time you pick. */
export async function wakeUp(at = Date.now()) {
  const running = await getRunning();
  if (running?.kind === 'sleep') await db.sessions.update(running.id, { end: Math.max(at, running.start) });
}

/** For the very first day: log last night's sleep after the fact. */
export async function logPastSleep(start: number, end: number) {
  await db.sessions.add({ id: newId(), kind: 'sleep', activityId: null, sleepType: 'main', start, end, source: 'manual' });
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

/**
 * Change when a session started (e.g. "I actually started 20 minutes ago").
 * Anything earlier that overlaps is shortened, or removed if it's fully covered.
 */
export async function changeStart(sessionId: string, newStart: number) {
  await db.transaction('rw', db.sessions, async () => {
    const target = await db.sessions.get(sessionId);
    if (!target) return;
    const nearby = await db.sessions.where('start').below(target.start).toArray();
    const plan = planStartChange(nearby, target, newStart);
    for (const s of plan.trim) await db.sessions.update(s.id, { end: newStart });
    await db.sessions.bulkDelete(plan.remove.map((s) => s.id));
    await db.sessions.update(sessionId, { start: newStart });
  });
}

/** Applies an overlap plan from planInsert (must be called inside a transaction on db.sessions). */
async function applyPlan(plan: InsertPlan) {
  for (const { session, end } of plan.trimEnd) await db.sessions.update(session.id, { end });
  for (const { session, start } of plan.moveStart) await db.sessions.update(session.id, { start });
  for (const { session, firstEnd, secondStart } of plan.split) {
    await db.sessions.update(session.id, { end: firstEnd });
    await db.sessions.add({ ...session, id: newId(), start: secondStart });
  }
  await db.sessions.bulkDelete(plan.remove.map((s) => s.id));
}

/** Overlapping sessions that touch [start, end]. */
async function overlapping(start: number, end: number) {
  return db.sessions.where('start').below(end).filter((s) => (s.end ?? Date.now()) > start).toArray();
}

/**
 * Saves a block of time and makes room for it: anything it overlaps is shortened, moved, split, or removed.
 * Used by the time editor, gap fill, and logging a missed sleep.
 */
export async function placeSession(session: Omit<Session, 'id'> & { id?: string }): Promise<string> {
  const id = session.id ?? newId();
  const end = session.end ?? Date.now();
  await db.transaction('rw', db.sessions, async () => {
    if (session.end === null) {
      // Making this the running one: stop anything else that's running.
      const others = await db.sessions.filter((s) => s.end === null && s.id !== id).toArray();
      for (const o of others) await db.sessions.update(o.id, { end: Math.max(o.start, Math.min(Date.now(), session.start)) });
    }
    const plan = planInsert(await overlapping(session.start, end), session.start, end, Date.now(), id);
    await applyPlan(plan);
    await db.sessions.put({ ...session, id } as Session);
  });
  return id;
}

/** Logs a main sleep you forgot to log. Returns its id, so the day it ended can be closed out. */
export async function logMissedSleep(start: number, end: number): Promise<string> {
  return placeSession({ kind: 'sleep', activityId: null, sleepType: 'main', start, end, source: 'manual' });
}

/** Saves (or updates) the review that closes out a day. */
export async function saveReview(sleepId: string, fields: Pick<DayReview, 'mood' | 'energy' | 'note'>) {
  const existing = await db.reviews.where('sleepId').equals(sleepId).first();
  if (existing) await db.reviews.update(existing.id, fields);
  else await db.reviews.add({ id: newId(), sleepId, closedAt: Date.now(), ...fields });
}

export async function saveGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'archived'> & Partial<Goal>) {
  await db.goals.put({ archived: false, createdAt: Date.now(), ...goal, id: goal.id ?? newId() });
}

export async function deleteGoal(id: string) {
  await db.goals.delete(id);
}

export async function saveSettings(changes: Partial<Settings>) {
  await db.transaction('rw', db.settings, async () => {
    const current = (await db.settings.get('#main')) ?? DEFAULT_SETTINGS;
    await db.settings.put({ ...current, ...changes, id: '#main' });
  });
}

// ---------------------------------------------------------------------------
// Routines
// ---------------------------------------------------------------------------

export async function saveRoutine(r: Omit<Routine, 'id' | 'createdAt'> & Partial<Routine>) {
  await db.routines.put({ createdAt: Date.now(), ...r, id: r.id ?? newId() });
}

export async function deleteRoutine(id: string) {
  await db.routines.delete(id);
}

/** Starts a routine at a step (starting that step's activity). Past the last step, the routine ends. */
export async function goToRoutineStep(routine: Routine, step: number) {
  if (step >= routine.activityIds.length) {
    await saveSettings({ activeRoutine: undefined });
    return;
  }
  await startActivity(routine.activityIds[step]);
  await saveSettings({ activeRoutine: { routineId: routine.id, step } });
}

export async function endRoutine(stopTimer: boolean) {
  if (stopTimer) await stopRunning();
  await saveSettings({ activeRoutine: undefined });
}

/** Ends the running activity at an earlier time ("I stopped at 2:40"). */
export async function stopRunningAt(at: number) {
  await stopRunning(Math.min(at, Date.now()));
}
