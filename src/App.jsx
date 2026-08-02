import { useMemo, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useDarkMode } from './lib/useDarkMode';
import { useSupabaseAuth } from './lib/useSupabaseAuth';
import { useImmersioState } from './lib/useImmersioState';
import { insertLanguage, updateLanguage, deleteLanguage, insertLog, deleteLog } from './lib/immersioApi';
import { nextColor } from './lib/languageColors';
import { computeCurrentStreak, computeLongestStreak } from './lib/streak';
import { PageHeader } from './components/PageHeader';
import { StreakCard } from './components/StreakCard';
import { LogForm } from './components/LogForm';
import { LogList } from './components/LogList';
import { LanguageManager } from './components/LanguageManager';
import { StatsPage } from './components/StatsPage';

export default function App() {
  const [isDark, setIsDark] = useDarkMode();
  const [page, setPage] = useState('log');
  const { userId, authLoading, authError } = useSupabaseAuth();
  const { languages, setLanguages, logs, setLogs, loading, error, retry } = useImmersioState(userId);

  const languagesById = useMemo(() => new Map(languages.map((l) => [l.id, l])), [languages]);

  const logDates = useMemo(() => [...new Set(logs.map((l) => l.log_date))], [logs]);
  const currentStreak = useMemo(() => computeCurrentStreak(logDates), [logDates]);
  const longestStreak = useMemo(() => computeLongestStreak(logDates), [logDates]);

  async function handleAddLanguage(name) {
    const optimisticId = crypto.randomUUID();
    const color = nextColor(languages.length);
    const optimistic = { id: optimisticId, user_id: userId, name, color, is_dormant: false, position: languages.length };
    setLanguages((prev) => [...prev, optimistic]);
    try {
      const saved = await insertLanguage({ userId, name, color, position: languages.length });
      setLanguages((prev) => prev.map((l) => (l.id === optimisticId ? saved : l)));
    } catch {
      setLanguages((prev) => prev.filter((l) => l.id !== optimisticId));
    }
  }

  async function handleToggleDormant(id, isDormant) {
    setLanguages((prev) => prev.map((l) => (l.id === id ? { ...l, is_dormant: isDormant } : l)));
    try {
      await updateLanguage(id, { is_dormant: isDormant });
    } catch {
      setLanguages((prev) => prev.map((l) => (l.id === id ? { ...l, is_dormant: !isDormant } : l)));
    }
  }

  async function handleDeleteLanguage(id) {
    const previous = languages;
    setLanguages((prev) => prev.filter((l) => l.id !== id));
    setLogs((prev) => prev.filter((l) => l.language_id !== id));
    try {
      await deleteLanguage(id);
    } catch {
      setLanguages(previous);
      retry();
    }
  }

  async function handleAddLog({ languageId, activity, minutes, logDate, note }) {
    const optimisticId = crypto.randomUUID();
    const optimistic = {
      id: optimisticId,
      user_id: userId,
      language_id: languageId,
      activity,
      minutes,
      log_date: logDate,
      note: note || null,
    };
    setLogs((prev) => [optimistic, ...prev]);
    try {
      const saved = await insertLog({ userId, languageId, activity, minutes, logDate, note });
      setLogs((prev) => prev.map((l) => (l.id === optimisticId ? saved : l)));
    } catch {
      setLogs((prev) => prev.filter((l) => l.id !== optimisticId));
    }
  }

  async function handleDeleteLog(id) {
    const previous = logs;
    setLogs((prev) => prev.filter((l) => l.id !== id));
    try {
      await deleteLog(id);
    } catch {
      setLogs(previous);
    }
  }

  const isBooting = authLoading || (Boolean(userId) && loading);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white/90 p-3 sm:p-4 md:p-8 font-sans transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <PageHeader page={page} onSelectPage={setPage} isDark={isDark} onToggleDark={setIsDark} streak={currentStreak} />

        <main className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full px-3 py-1">
              <Sparkles size={13} />
              Immersio
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white/90">
              Language immersion tracker
            </h1>
          </div>

          {(authError || error) && (
            <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
              <span>Something went wrong loading your data.</span>
              <button type="button" onClick={retry} className="flex items-center gap-1.5 font-semibold hover:underline">
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {isBooting ? (
            <div className="py-16 text-center text-sm text-slate-500 dark:text-white/50">Loading&hellip;</div>
          ) : page === 'log' ? (
            <div className="space-y-4">
              <StreakCard currentStreak={currentStreak} longestStreak={longestStreak} daysLogged={logDates.length} />
              <LogForm languages={languages} onSubmit={handleAddLog} />
              <LogList logs={logs} languagesById={languagesById} onDelete={handleDeleteLog} />
              <LanguageManager
                languages={languages}
                onAdd={handleAddLanguage}
                onToggleDormant={handleToggleDormant}
                onDelete={handleDeleteLanguage}
              />
            </div>
          ) : (
            <StatsPage logs={logs} languages={languages} />
          )}
        </main>
      </div>
    </div>
  );
}
