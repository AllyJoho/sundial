# Accounts & sync

**Goal:** the same Sundial on my phone and my computer, kept simple.

**Status:** built and switched off. It turns on when a sync address is added (steps in `README.md` → "Accounts & sync"). Sync hasn't been tested against a real server yet, because creating one needs the owner's email.

## Recommendation: Dexie Cloud

Sundial already stores everything with a library called Dexie. **Dexie Cloud** is the same team's add-on that syncs a Dexie database to an online account. That makes it the smallest change by far.

- **Sign-in is an email code, no password.** Enter your email, type the code it sends.
- **Offline-first.** The app keeps working with no signal, and changes sync when you're back online. This matches how Sundial already works.
- **Free, and stays free for this use.** The free plan is described as "forever free" with 3 permanent ("production") users and 100 MB of storage. Years of Sundial data is far under that.
- **One catch:** new users start on a 30-day trial. The 30 days only count days you actually sync. To stay free permanently, give your own account one of the 3 permanent seats in the Dexie Cloud dashboard (see README). If that step gets missed, the app keeps working on each device; only syncing pauses.
- **Data:** stored by Dexie Cloud (a small company, dexie.org). It isn't end-to-end encrypted, so treat it like any normal cloud app. Backup & export still works, and is still the way to keep your own copy.

### Alternatives considered

| Option | Why not (for now) |
|---|---|
| **Supabase** (database + email login) | Free, but free projects pause after about a week without use. Sundial would also need its own sync code (offline changes, conflicts), which is a lot more work and a lot more to get wrong. |
| **Firebase / Firestore** (Google) | Free tier is generous, but it would mean replacing Dexie and rewriting how all data is stored. Its offline cache only keeps what's been read recently, so it isn't truly offline-first. |
| **Build my own server** | The most work, plus a server to maintain. Not worth it for a personal app. |
| **No accounts: Backup & export between devices** | Already works today (More → Backup & export), but it's manual and one-way. |

If Sundial ever becomes a real product with many users, this choice should be revisited: Dexie Cloud's paid plan costs about €0.12 per user per month, or the data could move to a custom backend.

## How it's built

- **Off unless configured.** With no sync address, the app is exactly as before: one local database named `sundial`, nothing sent anywhere.
- **With sync on**, Dexie Cloud uses its own database on the device (`sundial-<something>`). The old local database is **left untouched**, and the app offers once: *"Your earlier data is safe — copy it into sync?"* Choose "Copy" on the device with your real data and "Don't copy" on a device with test data.
- **Fixed ids start with `#`** (e.g. `#cat-school`, `#main`). In Dexie Cloud, `#` ids are private to each person. Your phone and computer both create the same starter categories, which merge instead of duplicating, and they can't clash with anyone else's. Older data and older backups are renamed automatically.
- Starter items are inserted, never overwritten, so a new device doesn't reset categories you've renamed.
- Signing in is optional (`requireAuth: false`); the app is fully usable signed out.

## Open questions / to verify once it's live

- [ ] Sign in on two devices; check a timer started on one shows up on the other.
- [ ] Rename a starter category on one device, then set up a brand-new device: the rename should survive (starter items use insert-only adds, so the synced version should win).
- [ ] Give your own account a permanent seat in the Dexie Cloud dashboard.
- [ ] Decide whether to add Dexie Cloud's service worker for background sync (right now sync runs while the app is open, which is fine for daily use).
