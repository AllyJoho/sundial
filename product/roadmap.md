# Roadmap

Build in this order. Check items off as they're done. Each version should be **usable on my phone** before moving on.

## v1: Core (usable every day)
- [x] Project setup: Vite + React + TypeScript PWA in `app/`
- [ ] Installs to the iPhone home screen _(built in; needs testing on a real iPhone once hosted)_
- [x] Activities with categories and sub-activities (create, edit, quick-add as uncategorized)
- [x] Clock in / clock out (switching auto-stops the current activity)
- [x] Recents and favorites on the home screen
- [x] Sleep and wake logging (main sleep vs nap). A "☀️ Just woke up" button under "Going to sleep" logs a sleep you forgot to start.
- [x] Sleep-based "day" logic
- [x] Today's timeline, with editing for times, activity, and deletion
- [x] Change when the current activity or sleep started ("I started 20 min ago"), shortening whatever it overlaps
- [x] Data saved on device (IndexedDB)
- [ ] Hosted for free so it works away from home Wi-Fi _(waiting on the GitHub account)_

## v2: Goodnight & streaks
- [x] Goodnight flow: timeline review, gap fill (>1h), mood/energy, note (with "skip the review, just sleep")
- [x] "Forgot goodnight" detection on next open ("Did you sleep?" with a suggested time)
- [x] All-nighter prompt (~20h awake: "Did you sleep?" / "No, still going")
- [x] "Forgot good morning" detection (sleep timer running 14h+, nap 4h+)
- [x] Edit any past day, with quick access to yesterday (Days tab)
- [x] Streaks (days closed out in a row)
- [x] Streak recovery by backfilling within ~2 days (mostly-untracked days must be rebuilt in rough blocks)

## v3: Goals
- [x] Minimum and limit goals, daily and weekly (new goals suggest a small step from your real average)
- [x] Progress bars (limits shown neutrally, never red)
- [x] Sleep modes (Just track / Stabilize / Shift) and sleep goals (total sleep range, naps toggle, wake window)
- [x] Morning sleep summary on the home screen (vs. your own range and target, small wins)

## v4: Reviews
- [x] Week and month views (Trends tab, ‹ › to go back in time)
- [x] Time-by-category charts and trends (stacked bars per day; table with totals, per day, and per-day change vs last period). Naps show as their own "💤 Naps" row.
- [x] Calendar view on Trends (the "regular calendar view" from features.md): a week grid like iPhone Calendar, one column per date, midnight to midnight. Sleep, naps, and activities are drawn where they happened in category colors, untracked time is blank, an orange dot marks each wake-up (new day). Tap a block or a day for details and that date's totals. Month view shows thin columns per date. A small Sleep card underneath has the average, usual times, nights in range, and naps.
- [x] Morning check-in ("your best this week", vs your own 7-day average, days in a row near your target)
- [x] Daily goal hit rate per week/month
- [x] Category colors switched to a palette that's tested for color blindness (old colors upgrade automatically)

## v5: Quality of life
- [x] After-the-fact logging ("+ Log past time": what, how long, ended when; all taps)
- [x] "Still doing X?" nudge (when a timer runs well past your usual length for that activity)
- [x] Routines (one tap starts a sequence; Next moves through it)
- [x] Export/backup (JSON/CSV) and restore. **Pulled forward** (done alongside v3), since data only lives on the phone.
- [x] Freeze days (earn one per 7 days in a row, save up to 2; a missed day past the recovery window uses one)

## Still to do from v1
- [ ] Test installing to the iPhone home screen (needs hosting first)
- [ ] Host it for free (waiting on the GitHub account)

## Sun Check 2026-11-07 (see `product/sun-checks/2026-11-07.md`)
- [x] Streak counts a day only if more than half of it is tracked; closing with less is allowed
- [x] Fix past days in the normal timeline (tap a gap, your own times); removed the 3-hour "rebuild" blocks
- [x] "Just woke up? Log the sleep you missed", always available
- [x] "What are you doing?" box with suggestions; new activities saved uncategorized
- [x] "Your usual" tiles that learn from use (★ pins), with a 💤 Nap tile
- [x] Naps in "Log past time"; nap tip on the napping screen; naps in Trends
- [x] Overlapping blocks (multitasking) when editing: "Keep both" or "Make room"; full time counts for each
- [ ] Revisit: two live timers at once

## Sun Check 2026-11-07 (2): Today & Plan (see `product/sun-checks/2026-11-07-today-and-plan.md`)
- [x] Merge Now + Days into one **Today** tab (live timer and quick start, summary, diary, "Complete today", ‹ › for past days)
- [x] ~~Diary in parts of the day~~: reverted to one continuous diary (Sun Check (3))
- [x] Tab bar: Today · Plan · (+) · Trends · More, with a center + quick-log menu
- [x] **Plan** tab placeholder (intentions, schedule, tasks & assignments: coming soon)
- [ ] Build the Plan features (start with Today's intentions, research-ideas #2)

## Accounts & sync (pulled forward at the owner's request)
- [x] Sync between devices with Dexie Cloud, email-code sign-in, works offline (see `product/accounts.md`)
- [x] Offer to copy each device's pre-sync data; nothing deleted
- [ ] Turn it on: create the sync database and add its address (README → "Accounts & sync")
- [ ] Test with two real devices

## Sun Check 2026-11-07 (3): To-do list (see `product/sun-checks/2026-11-07-todo.md`)
- [x] "To do today" at the bottom of Today, plus a Later list
- [x] Optional notes, due date, and only-during hours on tasks
- [x] "Open right now" card while a task's hours are open
- [x] Goodnight: Tomorrow / Later / Remove for unfinished tasks (no pile-ups)
- [x] "Add to iPhone Calendar" setting, off by default
- [ ] Steps checklist inside a task
- [ ] Research follow-ups: see `research-ideas.md` section 13

## Moving data between devices (2026-11-07)
- [x] Copy / paste your data between phone and computer (shared clipboard). The pasted save wins; blocks on this device that fill its untracked time are kept. Preview before anything changes.

## The research plan (v6–v10)

_Where this comes from:_ `mission/science.md` (the research) → `product/research-ideas.md` (every idea, rated) → **this plan**. These are the ideas rated "Build next" or "Good candidate," grouped into milestones that each make sense on their own.

**How to read each item**
- **You'll see:** what it looks like in the app.
- **How it works:** the plain-language mechanics, including how it's stored.
- **Why:** the research behind it.
- **Done when:** how we know it's finished.

**Ground rules for every item below**
- Follows `mission/principles.md`: kind wording, one-tap logging, everything editable.
- **Stores raw facts only.** Days, scores and patterns are always calculated, never saved.
- **Everything new is optional or skippable.** If you ignore a new feature, Sundial works exactly like today.
- **Wording:** plain facts and comparison to *your own* past. No grades ("great job," "bad day"), no red, no points.

---

## v6: Sleep that fits real life (naps, long naps, split nights)
_Why first: it fixes real problems you've already hit (the 4½-hour nap), and it's already been handed to another session. Research: `science.md` → "Split sleep, long naps…"; full spec: `research-ideas.md` → "Sleep classification spec" (S1–S8)._

- [ ] **Total sleep is the headline, with the breakdown visible** (S1)
  - **You'll see:** the morning sleep summary and the Sleep page say "7h 10m slept (5h 40m night + 1h 30m nap)." Trends' hours-slept column uses the same total.
  - **How it works:** total = main sleep + that day's naps, when "naps count" is on (it already is by default). Naps are never averaged in as if they were separate nights.
  - **Why:** for alertness, total sleep per 24h matters most, however it's split (Mollicone 2008; Lo 2019).
  - **Done when:** every sleep number in the app agrees, and the breakdown shows whenever there was a nap.
- [ ] **"Nap or main sleep?" for sleeps of 3 hours or more** (S2, owner request #1)
  - **You'll see:** when you end a nap that lasted 3h+ (by tapping wake, through the check-in, or by editing it), a small sheet: "Long one, 4h 30m. Nap, or your main sleep?" One answer is pre-selected, and you tap to confirm or switch.
    - **Nap:** the day keeps going, and all 4h 30m counts toward total sleep.
    - **Main sleep:** your day closes when you fell asleep, and a new day starts when you woke up. The usual "close out yesterday" banner then appears.
  - **How it works:** the pre-selected answer depends on timing. If the sleep overlaps your usual night hours, "Main" is pre-selected; otherwise "Nap." Usual night hours = the middle of your last 14 main sleeps, or 10pm–8am if there isn't enough history yet. Switching only changes that sleep's type (main or nap). The days recalculate themselves.
  - **Why:** there's no scientific cutoff. 3h is the usual software convention (research trackers count rest over 3h as "major"; Garmin counts naps as under 3h). You decide, because only you know whether it was a crash or your night.
  - **Done when:** you can end a 4½h nap and see both choices work, and switching back and forth later in the editor works too.
- [ ] **"Still asleep?" check-in at 3 hours, with "I just woke up"** (S3, owner request #2)
  - **You'll see:** if a nap timer is still running at 3h (was 4h), the check-in shows **"I just woke up"** (wake = now) above the guessed time and "Pick a time." Choosing "I just woke up" on a 3h+ nap leads into the question above.
  - **Done when:** a truly long nap can be logged correctly in one tap.
- [ ] **Split nights count as one night** (S4)
  - **You'll see:** if you wake up and go back to main sleep within 2 hours (say 1–4am, then 6–9am), it shows as one night:
    - bedtime 1am, wake 9am, 6h asleep
    - "awake 2h in the night" shown in the Sleep trends row
    - no tiny one-hour "day" in between, and no goodnight review for it
  - **How it works:** this is calculated in the day logic (`day.ts`/`days.ts`). The two sleeps stay stored separately, as the "derive everything" rule requires. If a main sleep starts 2h or less after the previous main sleep ended, both belong to the same night. Bedtime = first start, wake = last end, asleep = only the sleeping parts.
  - **Why:** waking in the night and going back to sleep is a normal human pattern (Wehr 1992; historical "first/second sleep"). 2h is a judgment call based on the 1–3h gap in that research.
  - **Done when:** automated tests cover the three worked examples in `research-ideas.md`, and streaks, the Days tab and Trends all treat a split night as one night.
- [ ] **"Back to sleep (same night)" button** (S5)
  - **You'll see:** for 2 hours after good morning, the sleep button offers "Back to sleep (same night)" next to the usual options. Tapping it starts sleep with no goodnight review.
  - **Done when:** waking at 4am to use the bathroom and going back to bed is two taps, with no review.
- [ ] **Kind sleep wording** (S8)
  - "Long nap today, 4h 30m. Counted in your sleep total."
  - "Your sleep came in two parts last night, 6h total."
  - For naps ending after ~6pm: "Late naps can make it harder to fall asleep tonight. That's normal."
  - Never "broken," "interrupted," "bad," or health scares.

## v7: Kinder words and quick wins
_Why next: cheapest, highest-value changes. Mostly wording and small cards. Research: `research-ideas.md` sections 2, 3, 10._

- [ ] **Wording pass and a short style guide** (`product/wording.md`)
  - **What:** go through every message in the app and rewrite anything that grades you. Write the rules down so future sessions follow them:
    - facts first ("3h 10m")
    - compare to *your* past ("40m less than your usual")
    - no "great/bad/failed"
    - no exclamation-point praise
    - kind lines only after rough moments
  - Keep self-comparisons like "your best this week 🌱", since they're about your own past.
  - **Why:** over a third of feedback makes performance *worse* when it's about "am I good?" (Kluger & DeNisi 1996). Specific, factual feedback helps (Deci 1999).
  - **Done when:** every screen is checked against `wording.md`.
- [ ] **A kind line on rough days**
  - **You'll see:** in goodnight, if you rate mood 1–2 or the day was mostly untracked: "Days like this happen. Logging it still counts." There are a few versions, rotated, so it doesn't get stale.
  - **Why:** self-compassion *increases* effort the next day (Breines & Chen 2012; Wohl 2010).
- [ ] **"Logged 23 of the last 30 days" next to the streak**
  - **You'll see:** under the ☀️ streak badge (and on the Days tab), a quiet count of days that met the streak rule in the last 30.
  - **Why:** a single missed day never looks like zero. Broken streaks hurt most when people blame themselves (Silverman & Barasch 2023).
- [ ] **Welcome back after time away**
  - **You'll see:** if you open Sundial after 3+ days with nothing logged, a warm card: "Welcome back 👋 Pick up from today." There are two buttons:
    - **Start from today:** the gap stays untracked, no guilt.
    - **Fill in a few days:** opens the Days tab.
  - No streak-loss message on this card.
  - **Why:** in a 61,000-person study, the best program rewarded *coming back* after a miss (Milkman 2021). Lapsing and returning is normal (Epstein 2015).
- [ ] **🤝 Get support page** (More tab)
  - **You'll see:** a calm page with:
    - BYU CAPS: link and hours (**owner fills in the real link/number; don't guess**)
    - 988 (call or text)
    - "When sleep might need a doctor": insomnia most nights for months, severe night-owl schedule, loud snoring
    - "When to ask about ADHD": since childhood, everywhere, even when sleep and mood are okay
  - Text comes from `science.md`.
  - **Done when:** the page is reachable in 2 taps and has no alarming language.
- [ ] **☀️ "Outside" starter activity**
  - **You'll see:** a new starter activity, "☀️ Outside" (category Life). It isn't added to existing users' lists automatically; they're offered it once.
  - **Why:** light is the main lever on your body clock (Wright 2013), and about 2h a week in nature is linked to wellbeing (White 2019). Logging it makes it visible.
- [ ] **Recovery wording after all-nighters**
  - In the "Did you sleep?" / all-nighter flow: "Recovery takes a few nights. Waking at your usual time tomorrow helps your clock reset."
  - **Why:** one night doesn't undo sleep loss (Belenky 2003).
- [ ] **Add a principle: "No points, prizes, or loot"** in `mission/principles.md` _(owner to approve the wording)_
  - **Why:** rewards for doing things lower your own motivation (Deci 1999), and engagement tricks are what users are trying to escape.

## v8: Plan & reflect (the behavioral-activation loop)
_Why: logging + rating + light planning is behavioral activation, a proven depression treatment (Ekers 2014). Sundial already does the logging. This adds the other two parts without a calendar. Research: `science.md` Part 4 and Part 5; `research-ideas.md` Part A and section 1._

- [ ] **Today's intentions (1–3 small things), built into the existing to-do list**
  - _Note (2026-11-07): the Today tab already has a to-do list ("To do today" + Later, `tasks.ts` / `TodoList.tsx`). Intentions are **not a second list**. They're to-do items that can also be linked to an activity and given a rough time. One list, one goodnight step._
  - **You'll see:**
    - After good morning, an optional card: "Anything you want to do today?" with "+ Plan something" and "Not today." Dismissing it hides it until tomorrow. You can also add any time from "To do today" on the Today tab.
    - Planning: pick an activity (the same search box as clocking in) and a rough time: **Early in my day / Middle / Later / Anytime**. The labels show the clock times they mean for you, e.g. "Middle (≈ 3–8pm)".
    - Optional extras, folded away: **"Set an exact time"** (for appointments and deadlines only) and **"What might get in the way?"** (an if-then note: "If I'm still in bed at 11, I'll do 10 minutes first").
    - **Soft limit 3**, the same as the to-do list's (`research-ideas.md` 13d). Adding a 4th shows "That's a full day. Want to put some in Later?" No hard cap.
    - In "To do today," linked items show ○ planned, ◐ started, ✓ done.
  - **How it works:**
    - **No new table:** add two optional fields to the existing `Task`: `activityId` (the linked activity) and a rough window (early / middle / later / anytime). An exact time can reuse the task's existing hours. Old tasks without these work exactly as now.
    - **Status is calculated:** if you log any time on that activity (or one of its sub-activities) that day, it shows ◐. You tap ✓ when it's done, or it auto-ticks if you logged at least the time you usually spend on it.
    - **Windows follow *your* day:** the waking day is split into thirds based on your usual wake time and day length, not the clock. So a 4pm wake-up still has an "early in my day."
    - The day an intention belongs to is worked out from when it was planned. No "day" is stored.
  - **Why:**
    - BA scheduling, which works about as well as cognitive therapy (Cuijpers 2007).
    - Hourly isn't needed (Fazzino 2023).
    - Rough times, not exact ones, because exact start times make fun things feel like work (Tonietto & Malkoc 2016).
    - Exact times only for one-offs (Milkman 2011).
    - A max of 3, because BA warns "don't fill the day" and big plans backfire when you feel behind (Townsend & Liu 2012).
  - **Done when:** you can plan, see and finish intentions in three taps or fewer each, on your phone.
- [ ] **Intentions on the timeline**
  - **You'll see:** unfinished intentions show as a soft, dashed band over their window on today's timeline, next to what you actually did. Finished ones show as a small ✓ on the matching block.
  - **Why:** BA reviews "planned vs actual" daily (Veale 2008), and here it's shown, not judged.
- [ ] **Goodnight: extend the existing to-do step** (built in Sun Check (3): Tomorrow / Later / Remove)
  - **You'll see:** linked items also show ◐ "did some" when you logged time on them. Everything else stays as built: **Tomorrow / Later / Remove**, with **Later** pre-selected when 2+ are left.
  - **Rules:**
    - An item moved to Tomorrow **twice in a row** gets Later pre-selected next time, so nothing circles forever.
    - Items moved to Tomorrow count toward tomorrow's soft limit of 3. Never a growing list, never a ✗.
  - **Why:** unfinished plans that pile up trigger the "what-the-hell" effect and hurt people who feel behind.
- [ ] **"How did it feel?" ratings in goodnight**
  - **You'll see:** in the Mood/Energy step, a few of today's main activities (up to 3, longest first, never sleep). Each has two quick 3-point choices:
    - **Enjoyed:** 😐 🙂 😊
    - **Got something done:** ○ ◐ ●
  - Skippable as a whole. A setting can turn it off.
  - **How it works:** stored in that day's existing review record (`DayReview`) as a short list: activity → enjoyed, got done.
  - **Why:** rating enjoyment ("pleasure") and accomplishment ("mastery") is the core of BA's activity diary. Two quick taps per activity is about the 3-check-ins-a-day level that worked for students. It also includes "accomplishment counts even when it isn't fun."
- [ ] **"What lifts you" in Trends**
  - **You'll see:** after an activity has 3+ ratings, a simple list: each activity with its usual enjoyment and accomplishment, plus how many days it's based on ("Walk 😊● · 6 days"). No scores or rankings, and the wording is "tend to."
  - **Why:** BA's next step is noticing which activities lift your mood, then planning more of them.
- [ ] **"Usually takes you…" hint**
  - **You'll see:** when you plan an intention: "Usually takes you about 1h 50m (last 4 times)." It only shows when there are 3+ past sessions.
  - **Why:** everyone underestimates how long tasks take, partly because we misremember past ones (Buehler 1994; Roy, Christenfeld & McKenzie 2005). Your logged times fix that.
- [ ] **Count-based weekly goals** ("walk 3× this week")
  - **You'll see:** in Goals, a third option alongside minimum/limit: "**times per week**." It counts days you did it at all.
  - **Why:** brief BA plans with weekly counts, and it's kinder to chaotic weeks than daily targets.

## v9: See your patterns
_Why: descriptive views that turn data into "oh, interesting." No advice, no scores. Each needs only data Sundial already has. Research: `research-ideas.md` sections 4, 5, 6, 9._

- [ ] **Sleep regularity**
  - **You'll see:** on the Sleep trends view, "Sleep regularity: 72", explained as "how often you're asleep or awake at the same times on back-to-back days (100 = same every day)." Next to it: your own range over the last month. It needs 7+ days of sleep data, and shows "Needs a week of sleep" until then.
  - **How it works:** this is the Sleep Regularity Index. Each day is split into minutes, each marked asleep or awake (**all** sleep, naps included), and then compared with the same minute the next day. It's calculated on the fly from sleep sessions.
  - **Why:** regularity predicted grades and health as well as or better than sleep length (Phillips 2017; Windred 2024). Counting naps means a steady split-sleep or nap pattern isn't punished.
  - **Done when:** it has unit tests, including a perfectly regular week (100) and a split-sleep week.
- [ ] **Planned vs actual bedtime, and a bedtime plan**
  - **You'll see:** on the Sleep page, an optional "**Planned bedtime**" with two more fields, folded away:
    - "What usually keeps me up?" (e.g., "YouTube")
    - "If that happens, I'll…" (e.g., "put my phone on the charger by the desk")
    - A suggestion list of wind-down actions to pick one from.
  - In Sleep trends, a small tick shows your planned bedtime on each row, so the gap is visible ("planned 12:30, slept 1:45"), without color or judgment.
  - **Why:** an if-then bedtime plan reduced bedtime procrastination in two student trials (Valshtein 2020). Making the intended-vs-actual gap visible is the "reflect reality" version of Nauts' dimming lamp.
- [ ] **"When does it happen?" for any activity**
  - **You'll see:** in Trends, pick an activity (default 📱 Scrolling) to see a 24-hour bar chart of when it usually happens this week or month. Under it: "Often comes after: Class, Eating", the top 3 activities logged just before it.
  - **Why:** habits are set off by cues: times, places, what you were just doing (Wood & Rünger 2016). You can't change a cue you can't see.
- [ ] **"Last studied" per class**
  - **You'll see:** in Trends (or a School card), each sub-activity under School: "CS 235 · last 4 days ago · 2 sessions this week · 3h 10m." Plain facts, sorted by "longest since."
  - **Why:** spacing study sessions out is one of the two best study methods (Dunlosky 2013). Seeing the gaps makes spacing easy.
- [ ] **Weekday vs weekend split**
  - **You'll see:** a toggle on Trends charts showing weekday and weekend averages side by side. For sleep, that includes "sleep midpoint," which reveals "social jet lag."
  - **Why:** weekends differ, and mixing them hides patterns or fakes them.

## v10: Habit tools (scrolling and beyond)
_Why: these turn awareness into an optional choice. Awareness alone rarely changes behavior (Loid 2020); a self-chosen commitment or alternative does (Allcott 2022). Research: `science.md` Part 2; `research-ideas.md` sections 5, 8, 11._

- [ ] **Try a cutback (2–3 week experiment)**
  - **You'll see:** in Goals, "Try a cutback":
    1. Pick an activity (e.g., Scrolling).
    2. Pick a daily limit. It's suggested from your real average, e.g. "your usual is 3h 40m. Try 2h 30m?"
    3. Pick 2 or 3 weeks.
  - A small card shows "Day 6 of 14." At the end, a before-vs-during summary:
    - that activity
    - your sleep
    - mood, if rated
    - **what grew instead**
  - Results say honestly: "just your data, a few weeks; could be other things too."
  - **How it works:** a limit goal with a start and end date, plus a comparison against the 2–3 weeks before.
  - **Why:** cutbacks of 1–3 weeks help, cutting back works about as well as quitting (Burnell 2025), and the gains come from what replaces the scrolling (Castelo 2025).
- [ ] **"Instead" options**
  - **You'll see:** while a Scrolling (or any limited) timer runs, a quiet row under it: "Instead: 🚶 Walk · 📞 Call someone · 🎸 Guitar." One tap switches. You choose the 3–5 options in the activity's settings.
  - **Why:** an empty evening pulls you back to the phone. Having other rewarding options protects you (Acuff 2023).
- [ ] **🌊 "Rode out an urge"**
  - **You'll see:** a small button on the Scrolling timer card and in "Your usual," "🌊 Rode out an urge." Tapping logs a moment (no duration) and shows "Nice, that counts." There's an optional 90-second wave animation for riding it out.
  - Goodnight shows "🌊 2 today" when there are some.
  - **How it works:** a new small `moments` table (type, time). Moments aren't sessions, so they don't affect timelines or totals.
  - **Why:** urge surfing reduced the behavior even when the urges stayed (Bowen & Marlatt 2009). Counting it as a win avoids the slip-and-shame spiral.
- [ ] **💡 Tips & science page** (More tab)
  - **You'll see:** short tips by topic (Sleep, Scrolling, Studying, Rest), each with a "why" line and source from the fun-facts bank in `science.md`. It includes:
    - **Step-by-step setup for a "Pause before apps" iPhone Shortcut** (wait, then "Continue / Never mind"). The owner builds it once and can share it by iCloud link.
    - Grayscale
    - Notification batching (about 3×/day, not all-off)
    - Charging the phone away from bed
  - **Why:** the back-out option cut app openings by 57% (Grüning 2023). The app itself can't block other apps on iPhone (`iphone-feasibility.md`).
- [ ] **Tips in context**
  - One-line tips shown where they matter, each dismissible forever:
    - morning-light tip in Shift mode
    - caffeine tip when a bedtime plan is set
    - "quiz yourself" on a study timer
  - This builds on the existing nap tip. No random daily pop-ups.
- [ ] **Share my week (opt-in)**
  - **You'll see:** in Trends, "Share this week" makes an image card with facts you choose (sleep total and regularity, chosen activities, intentions done) and opens the iPhone share sheet (Messages, etc.). Nothing is sent unless you send it.
  - **Why:** reporting progress to someone helps self-monitoring work (Harkin 2016). This is the kind, opt-in version of the original "accountability" idea, without automatic texts or surveillance.

**Still later (from `research-ideas.md`; needs more data, a server, or a native app):**
- Pattern insights with guardrails (28+ days, strong links only, "early hint")
- Personal experiments
- Wind-down/goodnight reminders via iPhone Calendar export (.ics), then real push reminders (needs a small server)
- Apple Health sleep import
- Canvas due dates feeding intentions


## Later
_More research-rated candidates (not scheduled yet) are in `product/research-ideas.md`._
- [ ] Reminder notifications (needs a server on iPhone)
- [ ] Insights and correlations
- [ ] Native app (widgets, lock-screen timer)
- [ ] Canvas / Learning Suite task tracker
- [ ] Accountability messaging _(research suggests the opt-in "Share my week" card in v10 instead of automatic texts; owner to decide)_
- [ ] Android
