// Shown once after sync is turned on, if this device has data from before.
// Your earlier data is never deleted; this only decides whether to copy it into your synced account.
import { useEffect, useState } from 'react';
import { formatDuration } from '../format';
import type { DataBundle } from '../ids';
import { readLocalOnlyData, skipLocalData, uploadLocalData } from '../localImport';

export function LocalImportCard({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<DataBundle | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    readLocalOnlyData().then(setData).catch(() => setData(null));
  }, []);

  if (done) return <p className="notice">{done}</p>;
  if (!data) return null;

  const tracked = data.sessions.reduce((t, s) => t + ((s.end ?? Date.now()) - s.start), 0);
  return (
    <section className="card checkin">
      <h3>Your earlier data is safe</h3>
      <p className="muted">
        This device has {data.sessions.length} time blocks ({formatDuration(tracked)}) from before sync was turned on.
        {compact ? '' : ' Copy them into your account so they show up on all your devices?'}
      </p>
      {!compact && (
        <p className="muted small">
          Do this on the device with your real data. On a device with only test data, choose "Don't copy". Nothing is deleted
          either way.
        </p>
      )}
      <div className="row-buttons">
        <button
          className="btn primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await uploadLocalData(data);
              setDone(`Copied ${data.sessions.length} time blocks. They'll sync once you're signed in.`);
            } finally {
              setBusy(false);
            }
          }}
        >
          Copy into sync
        </button>
        <button
          className="btn"
          disabled={busy}
          onClick={() => {
            skipLocalData();
            setDone("OK, not copied. It's still saved on this device; you can copy it later from More → Account & sync.");
          }}
        >
          Don't copy
        </button>
      </div>
    </section>
  );
}
