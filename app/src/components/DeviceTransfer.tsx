// Move your data between your phone and computer by copy and paste (a shared clipboard, like Apple's
// Universal Clipboard, makes this two taps). The pasted save wins; blocks on this device that fill its
// untracked time are kept. Always shows a preview before changing anything.
import { useEffect, useState } from 'react';
import { copyText, decodeTransfer, deviceName, encodeTransfer, makeBackup, mergeIncoming, restoreBackup, type Backup } from '../backup';
import { formatAgo } from '../format';

interface Preview {
  incoming: Backup;
  merged: Backup;
  keptHere: number;
}

export function DeviceTransfer() {
  const [prepared, setPrepared] = useState<string | null>(null);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);
  const [pasted, setPasted] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const here = deviceName();

  // Get the copy ready as soon as the page opens: iPhone only allows copying during the tap itself,
  // so the text has to exist before you tap.
  async function prepare() {
    const b = await makeBackup();
    setPrepared(await encodeTransfer({ ...b, from: deviceName() }));
  }
  useEffect(() => {
    prepare();
  }, []);

  async function copy() {
    if (!prepared) return;
    const ok = await copyText(prepared);
    setCopyMsg(
      ok
        ? `Copied (${Math.max(1, Math.round(prepared.length / 1024))} KB). On your other device: More → Backup & export → paste it in the box.`
        : "Couldn't copy automatically. Tap \"Show the text\", select all of it, and copy it yourself.",
    );
    if (!ok) setShowText(true);
  }

  async function read(text: string) {
    setPasted(text);
    setError(null);
    setPreview(null);
    setDone(null);
    if (!text.trim()) return;
    try {
      const incoming = await decodeTransfer(text);
      const local = await makeBackup();
      const { merged, rescued } = mergeIncoming(local, incoming, Date.now());
      setPreview({ incoming, merged, keptHere: rescued.length });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function apply() {
    if (!preview) return;
    setBusy(true);
    try {
      await restoreBackup(preview.merged);
      setDone(`Done. This ${here} now has the save from your ${preview.incoming.from ?? 'other device'}.`);
      setPreview(null);
      setPasted('');
      prepare(); // the next copy from here includes the new data
    } finally {
      setBusy(false);
    }
  }

  const canReadClipboard = typeof navigator !== 'undefined' && !!navigator.clipboard?.readText && window.isSecureContext;

  return (
    <section className="card">
      <h3 className="card-title">Move between your devices</h3>
      <p className="muted small">
        Copy here, then paste on your other device. If your phone and computer share a clipboard (like iPhone + Mac), that's all it
        takes. The pasted save replaces what's on that device, except time blocks there that fill its untracked time.
      </p>

      <div className="stack">
        <button className="btn primary" onClick={copy} disabled={!prepared}>
          {prepared ? `📋 Copy my data (from this ${here})` : 'Getting your data ready…'}
        </button>
        {copyMsg && <p className="notice">{copyMsg}</p>}
        {prepared && (
          <button className="link-btn" onClick={() => setShowText(!showText)}>
            {showText ? 'Hide the text' : 'Show the text'}
          </button>
        )}
        {showText && prepared && <textarea readOnly rows={3} value={prepared} onFocus={(e) => e.target.select()} aria-label="Your data as text" />}
      </div>

      <div className="stack" style={{ marginTop: 14 }}>
        <label className="field">
          <span>Paste from your other device</span>
          <textarea
            rows={2}
            value={pasted}
            onChange={(e) => read(e.target.value)}
            // A paste replaces whatever was in the box (so leftovers from an earlier try can't break it).
            onPaste={(e) => {
              const t = e.clipboardData.getData('text');
              if (t) {
                e.preventDefault();
                read(t);
              }
            }}
            placeholder="Tap and hold here, then Paste"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        {pasted && (
          <button className="link-btn" onClick={() => read('')}>
            Clear the box
          </button>
        )}
        {canReadClipboard && (
          <button
            className="btn"
            onClick={async () => {
              try {
                read(await navigator.clipboard.readText());
              } catch {
                setError('Your browser blocked reading the clipboard. Tap and hold the box above, then Paste.');
              }
            }}
          >
            Paste from clipboard
          </button>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      {preview && (
        <div className="notice transfer-preview">
          <p>
            <strong>
              Save from your {preview.incoming.from ?? 'other device'}, copied {formatAgo(Date.now() - preview.incoming.exportedAt)}
            </strong>
          </p>
          <p>
            {plural(preview.incoming.sessions.length, 'time block')}, {plural(preview.incoming.tasks.length, 'task')}.
          </p>
          <p>
            {preview.keptHere > 0
              ? `Also keeping ${plural(preview.keptHere, 'block')} from this ${here} that ${preview.keptHere === 1 ? 'fills' : 'fill'} untracked time.`
              : `Nothing extra from this ${here} needs keeping.`}
          </p>
          <p className="muted small">Everything else on this {here} is replaced by the pasted save.</p>
          <div className="sheet-actions">
            <button className="btn primary" onClick={apply} disabled={busy}>
              Use this save
            </button>
            <button className="btn" onClick={() => read('')}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {done && <p className="notice">{done}</p>}
    </section>
  );
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
