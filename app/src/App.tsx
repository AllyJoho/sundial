// The app shell: loads data, works out days and streaks, and shows the tabs: Today · Plan · (+) · Trends · More.
import { useMemo, useState } from 'react';
import { cloudEnabled } from './cloud';
import { ErrorBanner } from './components/ErrorBanner';
import { LoginDialog } from './components/LoginDialog';
import { QuickLog, type QuickAction } from './components/QuickLog';
import { getDayState, type DayState } from './day';
import { getStreak, listDays, type Day, type StreakInfo } from './days';
import { useGoals, useLibrary, useNow, useReviews, useRoutines, useSessions, useSettings, useTasks, type Library } from './hooks';
import { MoreScreen } from './screens/MoreScreen';
import { PlanScreen } from './screens/PlanScreen';
import { TodayScreen } from './screens/TodayScreen';
import { TrendsScreen } from './screens/TrendsScreen';
import type { DayReview, Goal, Routine, Session, Settings, Task } from './types';

type Tab = 'today' | 'plan' | 'trends' | 'more';

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
  tasks: Task[];
}

export function App() {
  const [tab, setTab] = useState<Tab>('today');
  // The center "+" menu and the logging flows it (and the Today tab) open.
  const [quick, setQuick] = useState<QuickAction | null>(null);
  const lib = useLibrary();
  const sessions = useSessions();
  const reviews = useReviews();
  const goals = useGoals();
  const settings = useSettings();
  const routines = useRoutines();
  const tasks = useTasks();
  const minute = useNow(60_000); // re-check streak windows every minute

  const data = useMemo<AppData | undefined>(() => {
    if (!lib || !sessions || !reviews || !goals || !settings || !routines || !tasks) return undefined;
    const days = listDays(sessions, reviews);
    const streak = getStreak(days, Math.max(minute, Date.now()));
    return { lib, sessions, reviews, day: getDayState(sessions), days, streak, goals, settings, routines, tasks };
  }, [lib, sessions, reviews, goals, settings, routines, tasks, minute]);

  if (!data) return <div className="loading">☀️</div>;

  return (
    <div className="app">
      <ErrorBanner />
      {cloudEnabled && <LoginDialog />}
      <main>
        {tab === 'today' && <TodayScreen data={data} openQuick={setQuick} />}
        {tab === 'plan' && <PlanScreen />}
        {tab === 'trends' && <TrendsScreen data={data} />}
        {tab === 'more' && <MoreScreen data={data} />}
      </main>
      <QuickLog data={data} action={quick} setAction={setQuick} />
      <nav className="tabbar">
        <TabButton id="today" icon="⏱️" label="Today" tab={tab} setTab={setTab} />
        <TabButton id="plan" icon="🗓️" label="Plan" tab={tab} setTab={setTab} />
        <button className="tab-plus" onClick={() => setQuick('menu')} aria-label="Log something">
          <span aria-hidden>+</span>
        </button>
        <TabButton id="trends" icon="📊" label="Trends" tab={tab} setTab={setTab} />
        <TabButton id="more" icon="⚙️" label="More" tab={tab} setTab={setTab} />
      </nav>
    </div>
  );
}

function TabButton({ id, icon, label, tab, setTab }: { id: Tab; icon: string; label: string; tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <button className={tab === id ? 'on' : ''} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}>
      <span className="tab-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
