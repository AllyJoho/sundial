// Export and restore your data.
import { useState } from 'react';
import { lastBackupAt, makeBackup, markBackedUp, parseBackup, restoreBackup, saveFile, sessionsToCsv } from '../backup';
import { formatDuration } from '../format';

export function BackupPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const last = lastBackupAt();
  // Today's date in local time, e.g. 2026-11-06 (toISOString would use UTC and can be off by a day).
  const stamp = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  async function exportJson() {
    setError(null);
    const b = await makeBackup();
    await saveFile(`sundial-backup-${stamp()}.json`, JSON.stringify(b), 'application/json');
    markBackedUp();
    setStatus(`Backup made with ${b.sessions.length} time blocks.`);
  }

  async function exportCsv() {
    setError(null);
    const b = await makeBackup();
    await saveFile(`sundial-time-${stamp()}.csv`, sessionsToCsv(b), 'text/csv');
    setStatus('Spreadsheet made.');
  }

  async function restore(file: File) {
    setError(null);
    setStatus(null);
    try {
      const b = parseBackup(await file.text());
      const when = new Date(b.exportedAt).toLocaleString();
      const ok = window.confirm(
        `Replace ALL data on this device with the backup from ${when} (${b.sessions.length} time blocks)?\n\nAnything not in that backup will be gone. If unsure, make a backup first.`,
      );
      if (!ok) return;
      await restoreBackup(b);
      setStatus(`Restored the backup from ${when}.`);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <p className="muted" style={{ margin: 0 }}>
        Everything lives only on this phone. A backup is one file you can keep in Files, iCloud Drive, or email to yourself,
        and restore any time.
      </p>
      <section className="card">
        <h3 className="card-title">Back up</h3>
        <p className="muted small">
          {last ? `Last backup: ${formatDuration(Date.now() - last)} ago.` : "You haven't made a backup on this device yet."}
        </p>
        <div className="stack">
          <button className="btn primary" onClick={exportJson}>
            Save backup (.json)
          </button>
          <button className="btn" onClick={exportCsv}>
            Export time as a spreadsheet (.csv)
          </button>
        </div>
      </section>
      <section className="card">
        <h3 className="card-title">Restore</h3>
        <p className="muted small">Replaces everything on this device with a backup file.</p>
        <label className="btn file-btn">
          Choose backup file…
          <input
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (f) restore(f);
            }}
          />
        </label>
      </section>
      {status && <p className="notice">{status}</p>}
      {error && <p className="form-error">{error}</p>}
    </>
  );
}
