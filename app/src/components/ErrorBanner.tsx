// If something unexpected breaks, show it on screen instead of failing silently.
// (On a phone there's no developer console to look at.)
import { useEffect, useState } from 'react';

export function ErrorBanner() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const onError = (e: ErrorEvent) => setMessage(String(e.message || e.error));
    const onRejection = (e: PromiseRejectionEvent) => setMessage(String(e.reason?.message ?? e.reason));
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);
  if (!message) return null;
  return (
    <button className="error-banner" onClick={() => setMessage(null)}>
      <strong>Something went wrong.</strong> {message}
      <span className="small"> Tap to dismiss.</span>
    </button>
  );
}
