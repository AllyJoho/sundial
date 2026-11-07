// The app shell: loads data, works out days and streaks, and shows one of three tabs.
import { useMemo, useState } from 'react';
import { cloudEnabled } from './cloud';
import { ErrorBanner } from './components/ErrorBanner';
import { LoginDialog } from './components/LoginDialog';
import { getDayState, type DayState } from './day';
import { getStreak, listDays, type Day, type StreakInfo } from './days';
import { useGoals, useLibrary, useNow, useReviews, useRoutines, useSessions, useSettings, type Library } from './hooks';
import { DaysScreen } from './screens/DaysScreen';
import { MoreScreen } from './screens/MoreScreen';
import { NowScreen } from './screens/NowScreen';
import { TrendsScreen } from './screens/TrendsScreen';
import type { DayReview, Goal, Routine, Session, Settings } from './types';

type Tab = 'now' | 'days' | 'trends' | 'more';

/** Everything the screens need, worked out once here. */
export interface AppData {
  lib: Library;
  sessions: Session[];
  reviews: DayReview[];
  day: DayState;
  days: Day[];
  streak: StreakInfo;
  goals: Goal[];
  settings: Settings;
  routines: Routine[];
}

export function App() {
  const [tab, setTab] = useState<Tab>('now');
  const lib = useLibrary();
  const sessions = useSessions();
  const reviews = useReviews();
  const goals = useGoals();
  const settings = useSettings();
  const routines = useRoutines();
  const minute = useNow(60_000); // re-check streak windows every minute

  const data = useMemo<AppData | undefined>(() => {
    if (!lib || !sessions || !reviews || !goals || !settings || !routines) return undefined;
    const days = listDays(sessions, reviews);
    const streak = getStreak(days, Math.max(minute, Date.now()));
    return { lib, sessions, reviews, day: getDayState(sessions), days, streak, goals, settings, routines };
  }, [lib, sessions, reviews, goals, settings, routines, minute]);

  if (!data) return <div className="loading">☀️</div>;

  return (
    <div className="app">
      <ErrorBanner />
      {cloudEnabled && <LoginDialog />}
      <main>
        {tab === 'now' && <NowScreen data={data} />}
        {tab === 'days' && <DaysScreen data={data} />}
        {tab === 'trends' && <TrendsScreen data={data} />}
        {tab === 'more' && <MoreScreen data={data} />}
      </main>
      <nav className="tabbar">
        {(
          [
            ['now', '⏱️', 'Now'],
            ['days', '📋', 'Days'],
            ['trends', '📊', 'Trends'],
            ['more', '⚙️', 'More'],
          ] as const
        ).map(([id, icon, label]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}>
            <span className="tab-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
