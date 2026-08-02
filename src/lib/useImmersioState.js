import { useEffect, useState } from 'react';
import { fetchLanguages, fetchLogs } from './immersioApi';

export function useImmersioState(userId) {
  const [languages, setLanguages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [languageRows, logRows] = await Promise.all([fetchLanguages(userId), fetchLogs(userId)]);
        if (!cancelled) {
          setLanguages(languageRows);
          setLogs(logRows);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, retryKey]);

  const retry = () => setRetryKey((k) => k + 1);

  return { languages, setLanguages, logs, setLogs, loading, error, retry };
}
