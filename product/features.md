# Features & design

Everything we've designed so far. For build order, see `roadmap.md`.

---

## 1. The sleep-based "day" (the core idea)

**A day runs from when you wake up from your main sleep until your next main sleep.** It doesn't run midnight to midnight.

- **Good morning** starts a day. **Goodnight** starts the main sleep and closes the day.
- Starting a sleep asks **"Nap or going to bed?"** Naps are logged as sleep but don't end the day.
- **All-nighters:** if you never say goodnight, the day keeps going. After about 20h awake, the app gently asks: "Still going? Want to close out yesterday?"
- **Nocturnal schedules** just work. If you wake at 4pm, your day starts at 4pm.
- **Forgot goodnight:** on your next open, the app notices a gap and asks: "Looks like you slept ~2am–10am. Close yesterday?"
- The app also offers a **regular calendar view** for weekly and monthly charts.

**How it works under the hood:** store only timestamped intervals and calculate days from them. Changing the day rules later won't break old data.

## 2. Activities

**Category → Activity → Sub-activity**, for example:
- Productive → Homework → CS 235
- Leisure → Gaming
- Low-value leisure → Scrolling
- Sleep → Main sleep / Nap (built in)

- The user names and edits categories.
- **Quick add** creates an activity instantly as "uncategorized." Sort it out later.
- Easy to rename, re-categorize, merge, and archive.
- Optional colors and emoji per activity or category.

## 3. Tracking time

- **Clock in / clock out.** Starting a new activity automatically stops the current one, so only one activity runs at a time.
- **Recents and favorites** appear as big tap targets on the home screen.
- **After-the-fact logging:** "I did laundry for 30 min, ended 10 min ago."
- **"Still doing X?"** nudge when a timer runs much longer than usual for that activity.
- **Routines:** one tap starts a sequence, like "morning routine."
- Timers store a start time, so they stay correct when the app is closed.

## 4. Reviewing & editing

- **Today's timeline:** visual blocks you can tap to edit start/end times, change activity, split, or delete.
- **Untracked time** shows as gaps. Downtime is allowed. Gaps get collected at the end of the day.
- **Edit any past day**, with extra-easy access to **yesterday**.

## 5. Goodnight flow (end of day)

1. Show the day's timeline.
2. **Gap fill:** any untracked stretch **over 1 hour** gets a prompt: "What was this?" You can skip it or mark it as downtime.
3. Rate **mood** and **energy** (1–5).
4. Optional one-line note: "How was today?"
5. Start sleep. This closes the day and counts it toward the streak.

## 6. Goals

Works like calorie goals:
- **Minimum** ("at least 3h homework") or **limit** ("under 1h scrolling").
- Set per activity, sub-activity, or category.
- **Daily or weekly.**
- Shown as progress bars or rings. Going over a limit is shown neutrally, never as red-alarm failure.

## 7. Sleep goals & encouragement

**Reward consistency first and earlier times second.**

Sleep modes, which the user can switch any time:
1. **Just track:** no sleep goals, data only.
2. **Stabilize:** wake within about 1h of the same time daily, whatever that time is.
3. **Shift:** the target moves 15–30 min earlier per week, starting from your *actual* average.

Sleep goals:
- Total sleep (e.g. 7–9h). The user chooses whether naps count.
- Wake-time consistency ("days in window" or a score).
- Optional "in bed by X," relative to baseline.

Encouragement:
- Morning check-in compares you to **yourself**: "6h40 — your best this week."
- A chart of bed and wake times over weeks, so you can watch them settle.
- Small wins: "3 days in a row waking near your target."

Sleep stats: total sleep, naps, wake-time consistency, sleep debt.

## 8. Streaks (calorie-tracker style)

- A day counts once it's **closed out** with goodnight or a review.
- **Recovery:** missed days can be backfilled within **~2 days** and the streak comes back.
- **Recovery isn't free:** you have to enter wake/sleep times plus rough blocks ("morning: class, afternoon: homework, evening: games"). It's quick but real.
- A banner appears when a streak can be recovered: "Yesterday's unfinished — rebuild it to keep your 12-day streak."
- **Freeze days** are a possible add-on.

## 9. Reviews & progress

- Day, week, and month views.
- Time by category and activity, with trends over time.
- Goal hit rate over time.
- Sleep trends.
- **Later:** insights, e.g. "On days you slept 7h+, you did 40% more homework."

## 10. Data

- Stored on the device (IndexedDB) for now.
- **Export and backup** to JSON or CSV, so nothing gets lost.
- **Later:** accounts and cloud sync.

---

## Data model sketch

- **Category**: id, name, color, order
- **Activity**: id, name, categoryId, parentActivityId (for sub-activities), emoji/color, archived
- **Session** (the source of truth): id, activityId, start, end (empty if running), note, source (live / manual / backfill)
  - Sleep sessions also have `sleepType: main | nap`
- **DayReview**: dayStart, mood, energy, note, closedAt
- **Goal**: id, target (activity/category), type (min/limit), amount, period (day/week)
- **Settings**: sleepMode, target wake time, gap threshold (default 1h), etc.

Days, streaks, and stats are all **calculated** from Sessions and DayReviews, not stored separately.

---

## Platform notes (iPhone)

| Works as a web app (PWA) | Needs a native app later |
|---|---|
| Timers, logging, editing, charts | Home screen widgets |
| Streaks, goals, reviews | Live timer on the lock screen / Dynamic Island |
| On-device storage, export | Reliable reminder notifications |
| Install to home screen (Safari → Share → Add to Home Screen) | Automatic location- or app-based tracking |

---

## Future ideas (bigger)

- **Task tracker:** pull assignments from Canvas (calendar feed) and BYU Learning Suite (check whether it has a calendar export), track status, set "do dates" alongside due dates.
- **Accountability:** if you don't check something off by a deadline, it messages a friend. Needs a server and a texting service.
- Reminders: wind-down, "forgot to clock out," "do your goodnight."
- Android support if it becomes a real app.
