// "Still doing X?" (product/features.md section 3): a gentle nudge when a timer runs much longer than usual.
import type { Session } from './types';

const MIN = 60_000;

/** Your usual length for an activity: the middle value of its last 20 finished sessions (needs at least 3). */
export function typicalLength(sessions: Session[], activityId: string): number | null {
  const lengths = sessions
    .filter((s) => s.kind === 'activity' && s.activityId === activityId && s.end !== null)
    .slice(-20)
    .map((s) => s.end! - s.start)
    .sort((a, b) => a - b);
  if (lengths.length < 3) return null;
  return lengths[Math.floor(lengths.length / 2)];
}

export interface StillDoing {
  session: Session;
  elapsed: number;
  typical: number | null;
}

/**
 * Nudges when the running activity has gone on well past your usual length:
 * at least twice your usual, an hour more than usual, and 90 minutes total.
 * With no history yet, nudges after 4 hours.
 */
export function stillDoingCheck(sessions: Session[], now: number): StillDoing | null {
  const running = sessions.find((s) => s.end === null);
  if (!running || running.kind !== 'activity' || !running.activityId) return null;
  const elapsed = now - running.start;
  const typical = typicalLength(sessions, running.activityId);
  const threshold = typical === null ? 4 * 60 * MIN : Math.max(2 * typical, typical + 60 * MIN, 90 * MIN);
  return elapsed >= threshold ? { session: running, elapsed, typical } : null;
}
