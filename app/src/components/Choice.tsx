// Small tap-friendly controls that replace the browser's dropdowns (which take over the screen on phones).
import { formatDuration } from '../format';

/** A row of chips; tap one to choose it. Good for short lists (a handful of options). */
export function ChipChoice<T extends string | number | null>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="field">
      {label && <span>{label}</span>}
      <div className="chips" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            type="button"
            key={String(o.value)}
            role="radio"
            aria-checked={o.value === value}
            className={`chip ${o.value === value ? 'on' : ''}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** − value + for an amount of time. `step` and limits are in minutes. */
export function DurationStepper({
  minutes,
  onChange,
  step = 15,
  min = 0,
  max = 24 * 60,
  label,
  presets,
}: {
  minutes: number;
  onChange: (m: number) => void;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
  /** Optional quick chips (in minutes) under the stepper. */
  presets?: number[];
}) {
  const clamp = (m: number) => Math.min(max, Math.max(min, m));
  return (
    <div className="field">
      {label && <span>{label}</span>}
      <div className="stepper">
        <button type="button" className="step-btn" onClick={() => onChange(clamp(minutes - step))} disabled={minutes <= min} aria-label={`${step} minutes less`}>
          −
        </button>
        <span className="step-value">{minutes === 0 ? '0m' : formatDuration(minutes * 60_000)}</span>
        <button type="button" className="step-btn" onClick={() => onChange(clamp(minutes + step))} disabled={minutes >= max} aria-label={`${step} minutes more`}>
          +
        </button>
      </div>
      {presets && (
        <div className="chips">
          {presets.map((p) => (
            <button type="button" key={p} className={`chip ${p === minutes ? 'on' : ''}`} onClick={() => onChange(clamp(p))}>
              {formatDuration(p * 60_000)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
