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
- Scrolling & screens → Scrolling
- Sleep → Main sleep / Nap (built in)

- The user names and edits categories.
- **"What are you doing?"** box on the home screen: type a few letters to find a past activity, or type something new (like "took a test") to start it. New ones are saved as "uncategorized"; sort them later. _(Sun Check 2026-11-07)_
- Easy to rename, re-categorize, merge, and archive.
- Optional colors and emoji per activity or category.

## 3. Tracking time

- **Clock in / clock out.** Starting a new activity automatically stops the current one, so only one *live* timer runs at a time. (Two live timers at once is a "revisit later" idea.)
- **"Your usual"** tiles on the home screen: about 6 big tap targets that learn from what you use most (★ pins one). One-offs don't become tiles. 💤 **Nap** is always one of them.
- **Multitasking:** blocks may overlap when you edit or fill in time ("Keep both"). Each activity counts its full time; day summaries say "includes Xm multitasking".
- **After-the-fact logging:** "I did laundry for 30 min, ended 10 min ago."
- **"Still doing X?"** nudge when a timer runs much longer than usual for that activity.
- **Routines:** one tap starts a sequence, like "morning routine."
- Timers store a start time, so they stay correct when the app is closed.

## 4. Reviewing & editing

- **Today tab = dashboard + diary** (MyFitnessPal-style, Sun Check 2026-11-07 "Today and Plan"): the live timer and quick start on top, a summary (awake / tracked, tap for details), goals and sleep, then the **diary** (the day's timeline as one list, with **+ Add**), then **"To do today"**. **"Complete today"** at the bottom is goodnight. **‹ ›** goes to past days (diary only).
- **Center + button** in the tab bar logs from any tab: what are you doing, log past time, nap, going to bed, just woke up.
- Tap any block to edit start/end times, change activity, or delete it.
- **Untracked time** shows as gaps. Downtime is allowed. Gaps get collected at the end of the day.
- **Edit any past day**, with extra-easy access to **yesterday**. You fix a past day the same way as today: open its timeline and tap a gap or block to fill it in with your own times.
- **Log a missed sleep any time** ("Just woke up? Log the sleep you missed"), so you never have to wait for the check-in.

## 5. Goodnight flow (end of day)

1. Show the day's timeline.
2. **Gap fill:** the timeline is editable; untracked stretches **over 1 hour** are labeled "What was this?" Tap one to fill it in with your own times, or leave it. Untracked time is allowed.
3. Rate **mood** and **energy** (1–5).
4. Optional one-line note: "How was today?"
5. Start sleep. This closes the day and counts it toward the streak.

## 5b. To-do list (Sun Check 2026-11-07, "To-do list")

- **"To do today"** at the bottom of Today; type a line to add, ✓ to check off. Done items show until the day ends.
- **Later** list (folded up) for everything else, sorted by due date; "Do today" moves an item up. It moves to the Plan tab once Plan exists.
- Optional details: **notes / instructions**, **due date** ("due Fri", then a plain "was due Tue"), **only-during hours** (e.g. business hours Mon–Fri 9–5: "open now · until 5 PM" / "opens Mon 9 AM").
- **"Open right now"** card at the top of Today while a task's hours are open.
- **Goodnight:** each unfinished task → **Tomorrow / Later / Remove**. If 2+ are left, Later is pre-selected, so the list never piles up.
- Optional **"Add to iPhone Calendar"** (.ics; Calendar sends the alert). Off by default (More → To-do list).
- Later: a steps checklist inside a task.



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

- A day counts once it's **closed out** with goodnight or a review **and more than half of it is tracked** (overlapping blocks count once here). _(Sun Check 2026-11-07)_
- **Recovery:** within **~2 days**, an unclosed or under-half day can be closed out or filled in, and the streak comes back.
- **Recovery isn't free:** getting a day past the "more than half" bar takes real filling-in, done in the normal timeline.
- A banner appears when a streak can be recovered: "Yesterday isn't closed out yet…" or "…less than half is filled in. Fill in 3h more to keep your 12-day streak."
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
