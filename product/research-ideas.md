# Ideas from the research, rated

Every logical conclusion from the research in `mission/science.md`, turned into feature ideas, then checked: **does it actually help, how strong is the evidence, and how big is it to build?** Silly ideas are welcome here; they're labeled.

**This is an idea bank, not the roadmap.** `roadmap.md` still decides build order. Nothing here gets built until it's moved into the roadmap.

**Scheduled so far:** the "Build next" and most "Good candidate" ideas are planned in `roadmap.md` as **v6–v10** (sleep classification → kinder words → plan & reflect → patterns → habit tools).

_Written November 2026, against the app as it is now (v1–v5 built, sync built but off)._

## How ideas are rated
- **Helpful:** ⭐ to ⭐⭐⭐⭐⭐. How much it would help someone in a rough patch, judged on evidence *and* fit with the principles. 🚫 = would actually hurt.
- **Evidence:** Strong / Good / Some / Expert (clinicians do it, untested) / None / Against (evidence says it backfires).
- **Size:** **XS** (under an hour) · **S** (hours) · **M** (days) · **L** (weeks) · **XL** (needs a native app, a server, or major work). Sizes come from `iphone-feasibility.md`.
- **Verdict:**
  - **Build next**: high value, fits now
  - **Good candidate**
  - **Later**: needs something else first
  - **Idea pile**: fun, low priority, or unproven
  - **Don't build**

---

## Top picks (if you only read one section)

| # | Idea | Helpful | Size | Why |
|---|---|---|---|---|
| 1 | **Feedback wording pass:** make every message a plain fact, never a grade | ⭐⭐⭐⭐⭐ | S | Over a third of feedback makes things worse when it's about "am I good?" (Kluger & DeNisi). Cheapest high-value change. |
| 2 | **Today's intentions:** 1–3 small things, each with a *rough* time window | ⭐⭐⭐⭐⭐ | M | This is the scheduling half of behavioral activation, without the downsides of a calendar. See Part A. |
| 3 | **Enjoyment & accomplishment ratings** at goodnight | ⭐⭐⭐⭐⭐ | M | The rating half of behavioral activation. This turns Sundial from a log into the thing the research says works. |
| 4 | **"Logged 23 of the last 30 days"** next to the streak, plus a warm welcome back after gaps | ⭐⭐⭐⭐ | S | A single miss never looks like zero, and coming back gets celebrated (megastudy, Silverman & Barasch). |
| 5 | **Sleep Regularity Index** in Trends | ⭐⭐⭐⭐ | S–M | Regularity predicted grades and health as well as or better than sleep length. It can be derived from data Sundial already stores. |
| 6 | **Bedtime plan** (if-then and one wind-down action) and a **planned vs actual bedtime** mirror | ⭐⭐⭐⭐ | S–M | Two student RCTs on bedtime procrastination. |
| 7 | **"When does scrolling happen?"** an hour-of-day pattern | ⭐⭐⭐⭐ | S–M | Habits run on cues. You can't change a cue you can't see. |
| 8 | **Get support page** (CAPS, 988) | ⭐⭐⭐⭐ | XS | Almost free, and it matters if things get heavy. |
| 9 | **Study spacing view:** "CS 235: last studied 4 days ago" | ⭐⭐⭐⭐ | S | Spacing is one of the two best study methods. It can be derived from the sub-activities (classes) Sundial already has. |
| 10 | **"Pause before Instagram" Shortcut**, shared from a Tips page | ⭐⭐⭐⭐ | S | The back-out option cut app opens by 57% (Grüning). It doesn't need app code. |

---

## Part A: "Do we need a calendar?"

**Short answer: no, not a calendar. A lighter planning feature, yes.**

The hour-by-hour idea comes from classic behavioral activation. Here's what the research says when you follow it through:

1. **Planning probably matters.** Every proven BA package includes it, and "activity scheduling" alone worked about as well as cognitive therapy. But nobody has tested logging *without* planning, so we can't say logging alone is enough. → Sundial should add *some* planning.
2. **It doesn't need to be hourly.** Brief BA uses weekly targets. Students checking in hourly weren't more engaged than students checking in 3 times a day. → No hour grid needed.
3. **BA's own rule is "start small, don't fill the day."** → 1–3 things, not a full schedule.
4. **Exact start times make fun things feel like work** (13 studies). "Roughly scheduled" doesn't. → Rough windows like **morning / afternoon / evening / anytime**, not clock times.
5. **Exact date *and* time does help one-off, easy-to-miss things** (flu shots). → Allow an exact time as an *option* for appointments and deadlines only.
6. **Planning backfires for people who feel behind.** → Missed intentions must never pile up or roll over into a growing guilt list.
7. **BA reviews planned vs actual every day.** → Show intentions next to what really happened, kindly.
8. **Chaotic sleep breaks clock-based schedules.** → Windows should follow *your* day (Sundial's day starts when you wake), not the clock.

### The design that falls out of this

**Today's intentions**
1. At good morning, or any time, Sundial asks: "Anything you want to do today?"
2. Pick 1–3 activities from your list, for example "📚 Homework – CS 235", "🚶 Walk" or "📞 Call mom."
3. Each gets an optional rough window: Morning / Afternoon / Evening / Anytime. An exact time is offered only behind "set a time," for appointments.
4. Optional: tap "What might get in the way?" to add an if-then plan ("If I'm still in bed at 11, then I'll do 10 minutes first").

**Through the day**
- Intentions show as soft bands on the day timeline.
- When you clock into a matching activity, the intention quietly fills in. This needs zero extra taps.

**At goodnight**
- Each intention shows ✓ done, "did some", or "not today." There is never a ✗.
- "Not today" offers **"Carry to tomorrow"** or **"Let it go"**. "Let it go" is the default when 2+ things are missed.

**Weekly targets ("walk 3× this week")** fit as a goal type. Weekly goals already exist, so this is a small extension (count-based instead of minutes).

### Every calendar-ish option, rated

| Option | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| Full hour-by-hour calendar | ⭐ | Against (Tonietto; Townsend & Liu; BA "start small") | L | **Don't build.** It's the most taps, it spoils leisure, it breaks with chaotic sleep, it makes every miss visible, and iPhone Calendar already exists. |
| **Today's intentions** (1–3 small things, rough windows) | ⭐⭐⭐⭐⭐ | Good (BA scheduling; Tonietto rough; Milkman for one-offs) | M | **Build next** |
| Intentions shown on the timeline (planned vs actual) | ⭐⭐⭐⭐ | Expert (standard in BA) | M | **Build next**, together with intentions |
| "Let it go" or "carry over" on missed intentions, never piling up | ⭐⭐⭐⭐ | Good (Townsend & Liu; what-the-hell effect) | XS | **Build next**, part of intentions |
| Optional if-then plan / "What might get in the way?" on an intention | ⭐⭐⭐ | Good (implementation intentions; WOOP; smaller than once thought) | S | **Good candidate** |
| Count-based weekly goals ("walk 3× this week") | ⭐⭐⭐ | Some (brief BA) | S | **Good candidate** |
| Exact time + export to iPhone Calendar (.ics) for one-off appointments | ⭐⭐⭐ | Good (Milkman date + time) | S–M | **Good candidate.** iPhone Calendar then gives a real alert for free, with no server. |
| Planning-fallacy helper: "Your last 4 CS 235 sessions averaged 1h 50m" when planning | ⭐⭐⭐⭐ | Strong (Buehler; Roy & Christenfeld) | S | **Good candidate.** Uses data Sundial already has. |
| "Unpack" a big task into steps | ⭐⭐ | Some (Kruger & Evans) | M | **Idea pile.** Fits the future task tracker better. |
| Canvas / Learning Suite due dates feeding intentions | ⭐⭐⭐ | Expert | M (manual .ics import) / L (live, needs proxy) | **Later**, as part of the task tracker |
| Suggesting intentions from your own data ("Walks usually come before your better days. Add one?") | ⭐⭐⭐⭐ | Good (BA) | M | **Later**, after ratings and 28+ days of data |

---

## Part B: Conclusions → ideas, by topic

### 1. Behavioral activation (logging + ratings + planning)
**Conclusion:** BA's loop is: log activities → rate enjoyment and accomplishment → spot patterns → plan more of what helps. Sundial already does step 1. The rating step is the biggest missing piece.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **Enjoyment + accomplishment ratings** (😐🙂😊-style, 1 tap each) on the day's main activities at goodnight, skippable | ⭐⭐⭐⭐⭐ | Strong (BA monitoring; ratings 3×/day is plenty) | M | **Build next** |
| Optional rating right when you clock *out* of something | ⭐⭐⭐ | Some | S | **Good candidate.** Off by default, since extra taps cost a lot. |
| Mood *before and after* each activity | ⭐⭐ | Some | S | **Idea pile.** Too many taps. |
| "What lifts you" view: average enjoyment and accomplishment per activity | ⭐⭐⭐⭐ | Good | S (after ratings) | **Later**, after ratings |
| "Accomplishment counts even when it's not fun" framing in copy | ⭐⭐⭐ | Expert (BA mastery) | XS | **Good candidate** |
| Value tags on activities ("health", "people", "learning") | ⭐⭐ | Some/weak (complex BA no better than simple; values affirmation replication failed) | S | **Idea pile.** Optional at most. |

### 2. Feedback and wording
**Conclusion:** Plain facts help. Grades, praise and scolding can backfire. Rewards for doing things reduce enjoyment. Self-compassion increases effort.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **Wording pass over every message:** facts and comparison to your own past, no "great job / bad day" | ⭐⭐⭐⭐⭐ | Strong (Kluger & DeNisi; Deci) | S | **Build next** |
| A rough-day line after low mood or a missed goal ("Days like this happen. Logging it still counts.") | ⭐⭐⭐⭐ | Good (Breines & Chen; Adams & Leary; Wohl) | XS | **Build next.** Check what exists first. |
| Add a principle: **"No points, prizes, or loot."** | ⭐⭐⭐⭐ | Strong (Deci 1999) | XS | **Good candidate.** It's a docs change in `principles.md`. |
| A "your usual range" band instead of single targets in sleep and goal displays | ⭐⭐⭐ | Some (Michie: standard + feedback) | S | **Good candidate** |
| Points, XP, levels, badges | 🚫 | Against | — | **Don't build** |

### 3. Streaks and lapses
**Conclusion:** Streaks help while intact, and hurt when broken and blamed on yourself. Being able to repair one softens the break, which Sundial already does. Coming back deserves a reward. Lapsing is normal.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **"Logged 23 of the last 30 days"** next to the streak | ⭐⭐⭐⭐ | Good (Silverman & Barasch; Epstein) | S | **Build next** |
| **Welcome-back moment** after 3+ days away: warm, no guilt, offers a quick reconstruct or "start fresh from today" | ⭐⭐⭐⭐ | Good (Milkman megastudy: rewarding return; lived informatics) | S | **Build next** |
| Fresh-start nudge on Mondays and the 1st: "New week. Want to look at your goals?" | ⭐⭐⭐ | Good (Dai, Milkman & Riis) | S | **Good candidate** |
| Make backfill a "walk through yesterday" step-by-step flow (Day Reconstruction Method) | ⭐⭐⭐ | Good (Kahneman 2004) | M | **Good candidate.** Check against the current backfill, which already asks for rough blocks. |
| A "streak paused" mode for vacations or illness | ⭐⭐⭐ | Expert | S | **Good candidate.** Freeze days partly cover this. |

### 4. Sleep
**Conclusion:** Regularity matters as much as or more than duration. Wake time is the anchor. Light moves your body clock. Bedtime procrastination is the real enemy, not blue light. Recovery takes days. Self-reported sleep is optimistic. Sleep restriction is clinical-only.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **Sleep Regularity Index** (0–100) in Trends, next to duration, with a plain explanation | ⭐⭐⭐⭐ | Good (Phillips 2017; Windred 2024) | S–M | **Build next** |
| **Planned vs actual bedtime** gap, shown neutrally ("planned 12:30, slept 1:45") | ⭐⭐⭐⭐ | Good (Kroese; Nauts) | S | **Build next** |
| **Bedtime plan:** target bedtime + "what usually keeps me up?" + if-then + one wind-down action | ⭐⭐⭐⭐ | Good (Valshtein 2020 two RCTs; Giuntella) | S–M | **Good candidate** |
| **"☀️ Outside" starter activity / one-tap "got light" log** | ⭐⭐⭐ | Good (light science) | XS | **Build next.** It's just a starter activity and a tip. |
| Sleep midpoint and social jet lag (weekday vs weekend) chart | ⭐⭐⭐ | Some | S | **Good candidate** |
| Shift mode: allow a faster pace (up to 30 min every day or few days), never more than 1h/day, with a morning-light tip | ⭐⭐⭐ | Some (Gradisar 30 min/day; lab 1h/day) | S | **Good candidate.** Currently it's minutes per week. |
| After an all-nighter: "Recovery takes a few nights. Waking at your usual time helps." | ⭐⭐⭐ | Good (Belenky; Lo) | XS | **Build next** (a wording change to an existing prompt) |
| Caffeine cut-off hint based on *your* bedtime (~6h before) | ⭐⭐ | Some (Drake) | S | **Idea pile** |
| Nap tip when starting a nap: "10–20 min gives a boost without grogginess" | ⭐⭐ | Some (Brooks & Lack) | XS | **Good candidate** (copy only) |
| "Wind-down mode": the app dims or goes dark at your planned bedtime | ⭐⭐⭐ | Some (Nauts dimming lamp) | S | **Idea pile.** Fun and cheap. |
| Import Apple Health sleep and show "you logged vs your watch logged" | ⭐⭐⭐ | Good (self-report is optimistic: 69% vs 43%) | M | **Later** |
| Sleep score (a single number grade) | 🚫 | Against (orthosomnia) | — | **Don't build** |
| Sleep restriction / compression program | 🚫 | Against (weeks of sleepiness, drowsy driving, can trigger mania) | — | **Don't build.** Point to a clinician or a proper CBT-I program instead. |
| Melatonin advice or doses | 🚫 | — (clinical, and products are mislabeled) | — | **Don't build** beyond "ask a doctor" |

#### Sleep classification spec (naps, long naps, split nights)
_From round 4 research (`science.md` → "Split sleep, long naps, and what counts as main sleep"). Prompted by a real 4½-hour accidental nap. Ready for another session to build; the owner asked for #1 to wait for this research._

**The key facts:**
- Total sleep per 24h is what matters most for alertness, however it's split.
- Daytime sleep is real sleep, but lighter and shorter.
- Long or late naps push that night's sleep later.
- There's no official nap/main cutoff. **3 hours** is the common software convention (research wrist trackers treat >3h as "major," and Garmin's naps are <3h).
- Split nights are a normal human pattern, not "broken" sleep.

| # | Rule | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|---|
| S1 | **Headline = total sleep per day (main + naps), with the breakdown visible:** "7h 10m slept (5h 40m night + 1h 30m nap)." Keep the "naps count" setting, default on (as now). Never average naps in as if they were separate nights. | ⭐⭐⭐⭐ | Good (Mollicone; Lo; Jackson) | S | **Build next** |
| S2 | **Ask "nap or main sleep?" when a nap reaches 3h** (at wake-up, or when editing). Pre-select by timing: overlaps your usual night window → "Main sleep (starts a new day)"; otherwise → "Nap." It's the user's choice. Either way, all of it counts toward total sleep. | ⭐⭐⭐⭐ | Expert convention (3h) | S | **Build next.** This is owner request #1. |
| S3 | **Match the "Still asleep?" check-in to the same 3h** (currently 4h), and offer "I just woke up" alongside the guessed wake time. | ⭐⭐⭐ | — | XS | **Build next.** This is owner request #2. |
| S4 | **Split nights count as one night.** If a main sleep starts within **2h** of the previous main sleep ending, treat both as the same night: bedtime = first start, wake = final end, asleep time = only the sleeping parts, and the gap shows as "awake in the night." It must **not** create a tiny 1-hour "day." Do this in the calculated day logic, not by changing stored sessions (the "derive everything" rule). | ⭐⭐⭐⭐ | Some (Wehr 1–3h gap; historical "watch"); expert judgment for the 2h number | M | **Build next.** Prevents a real bug-like experience. |
| S5 | **Back to sleep shortcut:** after good morning, if you start sleeping again within 2h, offer "Back to sleep (same night)" so S4 happens without thinking. | ⭐⭐⭐ | — | S | **Good candidate** |
| S6 | **Bedtime, wake time and wake consistency stay main-sleep-only** (as now). Naps don't distort them. | ⭐⭐⭐ | Expert (sleep diary convention) | — | **Keep as is** |
| S7 | **Regularity score (future SRI) counts all sleep as "asleep,"** naps included. A split or nap pattern that repeats at the same times scores as regular, so it isn't punished. | ⭐⭐⭐⭐ | Good (Phillips 2017) | (part of SRI) | **Build with SRI** |
| S8 | **Neutral wording:** "Long nap today, 4h 30m. Counted in your sleep total." / "Your sleep came in two parts last night: 6h total." For naps ending after ~6pm, optionally: "Late naps can make it harder to fall asleep tonight. That's normal." Never "broken," "interrupted," "bad," or health scare claims. | ⭐⭐⭐⭐ | Good (Werth; Ye 2015) + principles | XS | **Build next** (with S2) |
| S9 | Weekly "long naps this week: 3" in sleep trends, framed as a hint of sleep debt, not a fault | ⭐⭐ | Some (Ye 2015; Yamada) | S | **Idea pile** |
| S10 | Calling split sleep "how humans are meant to sleep," or suggesting polyphasic schedules | 🚫 | Against (mixed history; polyphasic = no benefit) | — | **Don't build** |

**Worked examples:**
- **The 4½h accidental nap:** at wake-up, Sundial asks "Long one: 4h 30m. Nap, or your main sleep?" with Nap pre-selected (daytime). Choosing Nap means total sleep +4h 30m and the day continues. Choosing Main means the day closes and a new day starts at wake-up.
- **1am–4am, awake, 6am–9am:** with the gap ≤2h, this is one night: bedtime 1am, wake 9am, 6h asleep, "awake 2h in the night."
- **2am–5am, then 1pm–5pm:** with an 8h gap, these aren't one night. The night is the main sleep (bed 2am, wake 5am), and 1–5pm triggers the S2 question (Nap pre-selected). Both count toward a 7h total.

### 5. Scrolling and compulsive habits
**Conclusion:** It's cue-driven habit, not "dopamine." Environment and friction beat willpower. Back-out options work, and reflection prompts alone don't. Cutting back for 1–3 weeks works about as well as quitting, and gains come from what replaces the scrolling. Slips plus shame lead to relapse.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **"When does scrolling happen?"** by hour of day and what came before it | ⭐⭐⭐⭐ | Strong (Wood & Rünger, habits run on cues) | S–M | **Build next** |
| **Shareable iOS Shortcut: pause + back-out before chosen apps**, with setup steps in a Tips page | ⭐⭐⭐⭐ | Good (Grüning 2023) | S | **Good candidate** |
| **"Cutback experiment":** pick a limit for 2–3 weeks, see before/after for scrolling *and* sleep/mood/other activities | ⭐⭐⭐⭐ | Good (Castelo; Hunt; Allcott; Burnell) | M | **Good candidate** (builds on limit goals) |
| "Instead" list: your own 3–5 go-to replacement activities, one tap from the scrolling timer | ⭐⭐⭐ | Some–Good (alternative rewards; Castelo mechanism) | S | **Good candidate** |
| "🌊 Urge surfed" one-tap log that counts as a win, plus an optional 90-second wave timer | ⭐⭐⭐ | Some (Bowen & Marlatt) | S | **Good candidate** |
| "Guess your scrolling today" at goodnight vs logged | ⭐⭐ | Mixed (people misjudge *pickups* badly, but *time* only moderately) | S | **Idea pile** |
| Tips: grayscale, batch notifications 3×/day (don't turn them all off), phone charger away from bed | ⭐⭐⭐ | Good–Some | XS | **Good candidate** (part of a Tips page) |
| Auto-clock-in to Scrolling when TikTok opens | ⭐⭐⭐ | — | XL (blocked: Safari ≠ installed app storage) | **Idea pile.** Revisit with native or sync API. |
| Read Screen Time data | — | — | Impossible | **Don't build** (Apple doesn't allow it) |
| "Dopamine detox" mode or language | 🚫 | Against (pseudoscience) | — | **Don't build** |

### 6. Insights and patterns
**Conclusion:** Patterns in your own data need about **28+ varied days**, and only strong links are trustworthy. People misread their own data and treat "no evidence" as "proven." Weekends and bad-week rebounds fake patterns.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| Correlation insights ("nights over 7h tend to come before higher-mood days") **with guardrails:** 28+ days, strong links only, "early hint" label under 60 days, always show the day count, never say "causes" | ⭐⭐⭐ | Some (power math; TummyTrials) | M–L | **Later** (already on the roadmap as "Insights") |
| Personal experiments: "try X for 2 weeks, compare," with honest results ("not enough data yet" ≠ "no effect") | ⭐⭐⭐ | Some (TummyTrials; SleepCoacher) | L | **Later** |
| Weekday vs weekend split in charts | ⭐⭐⭐ | Some (confounds) | S | **Good candidate** |

### 7. Reminders and nudges
**Conclusion:** Prompts work at first and fade within about 4 weeks, and people find them boring. Reminders build dependence more than habit; cues tied to existing routines work better. Bedtime reminders alone have small effects. On iPhone, scheduled pushes need a server.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **Free reminder trick:** export a recurring "wind down" or "good night" event to iPhone Calendar (.ics), so Calendar does the alerting | ⭐⭐⭐ | Some | S–M | **Good candidate** (no server!) |
| Tip: use iPhone's built-in Sleep Schedule / Bedtime for the alarm side | ⭐⭐ | — | XS | **Good candidate** (copy only) |
| Real push reminders (wind-down, forgot to clock out, goodnight) via a Cloudflare Worker | ⭐⭐⭐ | Some (fades; Giuntella small) | L | **Later.** Keep them few, rotate the wording, and make them easy to turn off. |
| App badge "1" while a timer is running | ⭐⭐ | — | S | **Idea pile** (needs notification permission) |
| Smart "just-in-time" prompts (e.g., when scrolling runs past your usual) | ⭐⭐⭐ | Some (JITAI) | L | **Later.** The "Still doing X?" nudge already covers part of this in-app. |

### 8. Other people and accountability
**Conclusion:** Reporting progress to someone helps a bit. "Support" alone often does nothing. Comparison boosts activity but hurts self-esteem. Automated "tell on me" systems turn support into surveillance. Few people sign commitment contracts. The famous goals statistics are myths.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **Share a weekly summary card** (an image, facts only) via the iPhone share sheet. You choose who and when. | ⭐⭐⭐ | Some (Harkin reporting moderator; Wing & Jeffery) | S–M | **Good candidate.** The kind version of the original "accountability" idea. |
| "Check-in buddy": pick one person, and Sundial reminds *you* to send your summary on Sundays | ⭐⭐⭐ | Some | S | **Good candidate** |
| Automatic "text my friend if I don't finish" (the original accountability idea) | ⭐ | Against-ish (surveillance and shame; few take commitment devices) + XL (server, SMS fees) | XL | **Don't build** as automatic. The share card gives most of the benefit. |
| Leaderboards or comparing with friends | 🚫 | Against (upward comparison hurts) | — | **Don't build** |
| Shared "study room": see which friends are clocked into homework right now (body doubling) | ⭐⭐ | None–Some (social facilitation helps simple tasks, hurts complex ones) | XL | **Idea pile** (silly-ish, needs sync between people) |

### 9. School
**Conclusion:** Self-quizzing and spacing beat rereading and cramming. The night before an exam matters less than the month before. Feeling in control of your time matters more than output.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **Spacing view per class:** "CS 235 · last studied 4 days ago · 3 sessions this week" | ⭐⭐⭐⭐ | Strong (Dunlosky 2013) | S | **Build next** (uses existing sub-activities) |
| Study-method tips (quiz yourself, space it out) | ⭐⭐⭐ | Strong | XS | **Good candidate** (Tips page) |
| Canvas / Learning Suite due dates with "do dates" | ⭐⭐⭐ | Expert | M–L | **Later** (already on the roadmap as the task tracker) |

### 10. Support and safety
**Conclusion:** Depression, ADHD and insomnia are treatable, and an app isn't treatment. Low mood for weeks deserves a human.

| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **"Get support" page** in More: BYU CAPS, 988, "when to ask about ADHD" and "when sleep might need a doctor" | ⭐⭐⭐⭐ | Expert | XS | **Build next** |
| Gentle one-time note if mood is ≤2 for about 2 weeks: "Rough stretch lately. If it'd help to talk to someone, here's where." Never repeated, never alarming. | ⭐⭐⭐ | Expert | S | **Good candidate.** Wording must be very careful. |
| Diagnosing anything | 🚫 | — | — | **Don't build** |

### 11. Tips and learning (the "quotes / fun facts / articles" idea)
| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| **Tip of the day** card from the fun-facts bank in `science.md`, dismissible, each with its source | ⭐⭐⭐ | — (education) | S | **Good candidate** |
| A "Why Sundial works this way" page in More, listing the science behind each feature | ⭐⭐ | — | S | **Idea pile** |
| Context tips (e.g., the nap tip when you start a nap, the light tip in Shift mode) | ⭐⭐⭐ | — | S | **Good candidate.** More useful than random tips. |

### 12. Data safety (from the iPhone research)
| Idea | Helpful | Evidence | Size | Verdict |
|---|---|---|---|---|
| Gentle "last backup: 12 days ago" reminder on the home screen when sync is off | ⭐⭐⭐⭐ | — (deleting the icon likely deletes the data) | S | **Good candidate.** `lastBackupAt()` already exists. |
| Warn in the backup page: "Deleting the home-screen icon may delete your data." | ⭐⭐⭐ | — | XS | **Good candidate** |

---

## Part C: Silly and out-of-scope ideas (allowed here!)

| Idea | Helpful | Size | Notes |
|---|---|---|---|
| **"Sundial Wrapped":** a shareable year- or month-in-review ("You were outside 41 hours in October ☀️") | ⭐⭐⭐ | M | Fun, shareable, and pure reflection. Keep it facts-only. |
| **The app's sky follows your day:** the background goes from sunrise at good morning to dusk near your bedtime | ⭐⭐ | S–M | On theme, and quietly does the "lamp dims at bedtime" thing. |
| **Smart lights dim at your planned bedtime** (Philips Hue, etc.) | ⭐⭐⭐ | XL | Literally the Nauts lamp study. Needs a server or native app. |
| **"Light reset weekend" challenge:** camp or stay outdoors with lights low at night | ⭐⭐⭐ | XS (it's a tip) | A weekend of camping gave about 69% of a full week's body clock shift. Real science, and kind of an adventure. |
| **A little sun companion** that reacts to your day but **never gets sad, sick or dies** | ⭐ | L | No evidence for pets. Allowed only without guilt mechanics. |
| **Weekly letter from Claude** summarizing your week in plain, kind words | ⭐⭐⭐ | L | Needs an API key/server and raises privacy questions. Must follow the wording rules. |
| **"Temptation bundles":** link a treat to a task ("my show only while folding laundry") and track the pairing | ⭐⭐ | S | Real but small effect (Kirgios). |
| **White/brown noise toggle** during homework timers | ⭐⭐ | S | Slightly helps people with ADHD, slightly hurts others. Make it opt-in. |
| **Note to tomorrow-you** at goodnight, shown at good morning | ⭐⭐ | S | Cute. Not researched (future-self research wasn't covered). |
| **"Siri, I'm scrolling"** voice clock-in | ⭐⭐⭐ | XL | Same Safari-vs-installed-app storage problem as auto clock-in. |
| **Body-double livestream:** a "study with me" room inside Sundial | ⭐ | XL | Evidence is thin, and it's a huge build. |
| **Auto-detect "went outside" with GPS or light** | — | Impossible on web | Use the one-tap "☀️ Outside" log instead. |
| **Pay yourself / time bank / XP** | 🚫 | — | Rewards undermine motivation. Never. |

---

## Suggested next steps (for the owner to decide)
1. **Quick wins (XS–S, about a day total):**
   - Feedback wording pass
   - Get support page
   - "Outside" starter activity
   - All-nighter recovery wording
   - "Logged X of last 30 days"
   - Backup reminder
2. **A "v6: Plan & reflect" milestone (M):**
   - Today's intentions with timeline bands
   - Enjoyment/accomplishment ratings at goodnight
   - Welcome-back moment
3. **A "v7: Sleep & habits insights" milestone (S–M each):**
   - Sleep Regularity Index
   - Planned vs actual bedtime and the bedtime plan
   - Scrolling-by-hour
   - Study spacing view
4. **Later:** cutback experiments, the tips page and the Shortcut, the share card, then push reminders and insights once there's enough data.

If you like this order, it can be moved into `roadmap.md`.
