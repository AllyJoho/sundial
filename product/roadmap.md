# Roadmap

Build in this order. Check items off as they're done. Each version should be **usable on my phone** before moving on.

## v1: Core (usable every day)
- [x] Project setup: Vite + React + TypeScript PWA in `app/`
- [ ] Installs to the iPhone home screen _(built in; needs testing on a real iPhone once hosted)_
- [x] Activities with categories and sub-activities (create, edit, quick-add as uncategorized)
- [x] Clock in / clock out (switching auto-stops the current activity)
- [x] Recents and favorites on the home screen
- [x] Sleep and wake logging (main sleep vs nap)
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
- [x] Time-by-category charts and trends (stacked bars per day; table with totals, per day, and per-day change vs last period)
- [x] Sleep trends chart (bedtime → wake-up bars, with your wake target window)
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

## Accounts & sync (pulled forward at the owner's request)
- [x] Sync between devices with Dexie Cloud, email-code sign-in, works offline (see `product/accounts.md`)
- [x] Offer to copy each device's pre-sync data; nothing deleted
- [ ] Turn it on: create the sync database and add its address (README → "Accounts & sync")
- [ ] Test with two real devices

## Later
- [ ] Reminder notifications (needs a server on iPhone)
- [ ] Insights and correlations
- [ ] Native app (widgets, lock-screen timer)
- [ ] Canvas / Learning Suite task tracker
- [ ] Accountability messaging
- [ ] Android
