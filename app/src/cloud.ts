// Optional sync between devices, using Dexie Cloud (https://dexie.org/cloud).
//
// Sync is OFF unless a database address is set. To turn it on, see "Accounts & sync" in README.md:
// it's one command (`npx dexie-cloud create`) that gives you an address, which goes in app/.env as
//   VITE_DEXIE_CLOUD_URL=https://xxxxxxxx.dexie.cloud
// The address isn't a secret (it's included in the app). The key file the command also creates IS
// secret and must never be committed (it's in .gitignore).

const url = (import.meta.env.VITE_DEXIE_CLOUD_URL as string | undefined)?.trim();

/** The sync database address, or undefined if sync isn't set up. */
export const CLOUD_URL = url ? url : undefined;
export const cloudEnabled = !!CLOUD_URL;
