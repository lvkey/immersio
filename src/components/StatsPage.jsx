import { useMemo, useState } from 'react';
import { ACTIVITY_TYPES } from '../lib/activityTypes';
import { formatMinutes } from '../lib/format';
import { ActivityBarChart } from './ActivityBarChart';
import { ActivityHeatmap } from './ActivityHeatmap';

const RANGES = [
  { key: '7', label: '7 days', days: 7 },
  { key: '30', label: '30 days', days: 30 },
  { key: '90', label: '90 days', days: 90 },
  { key: 'all', label: 'All time', days: null },
];

export function StatsPage({ logs, languages }) {
  const [range, setRange] = useState('30');

  const filteredLogs = useMemo(() => {
    const days = RANGES.find((r) => r.key === range)?.days;
    if (!days) return logs;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (days - 1));
    cutoff.setHours(0, 0, 0, 0);
    return logs.filter((log) => new Date(`${log.log_date}T00:00:00`) >= cutoff);
  }, [logs, range]);

  const totalMinutes = filteredLogs.reduce((sum, l) => sum + l.minutes, 0);
  const sessionCount = filteredLogs.length;

  const byLanguage = useMemo(() => {
    const totals = new Map();
    for (const log of filteredLogs) {
      totals.set(log.language_id, (totals.get(log.language_id) ?? 0) + log.minutes);
    }
    return languages
      .filter((lang) => totals.has(lang.id))
      .map((lang) => ({ id: lang.id, label: lang.name, value: totals.get(lang.id), color: lang.color }));
  }, [filteredLogs, languages]);

  const byActivity = useMemo(() => {
    const totals = new Map();
    for (const log of filteredLogs) {
      totals.set(log.activity, (totals.get(log.activity) ?? 0) + log.minutes);
    }
    return ACTIVITY_TYPES.filter((a) => totals.has(a.id)).map((a) => ({
      id: a.id,
      label: a.label,
      value: totals.get(a.id),
    }));
  }, [filteredLogs]);

  const minutesByDate = useMemo(() => {
    const totals = new Map();
    for (const log of logs) {
      totals.set(log.log_date, (totals.get(log.log_date) ?? 0) + log.minutes);
    }
    return totals;
  }, [logs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex flex-wrap bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg p-1 gap-1 shadow-sm">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`text-xs sm:text-sm font-semibold rounded-md px-3 py-1.5 transition-colors ${
                range === r.key
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-500 dark:text-white/60 hover:text-slate-700 dark:hover:text-white/90 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-500 dark:text-white/50">
          <span className="font-semibold text-slate-800 dark:text-white/90">{formatMinutes(totalMinutes)}</span> across{' '}
          <span className="font-semibold text-slate-800 dark:text-white/90">{sessionCount}</span> session
          {sessionCount === 1 ? '' : 's'}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold text-slate-800 dark:text-white/90 mb-4">Last 14 Weeks</h2>
        <ActivityHeatmap minutesByDate={minutesByDate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800 dark:text-white/90 mb-4">Time by Language</h2>
          <ActivityBarChart data={byLanguage} formatValue={formatMinutes} emptyLabel="No sessions in this range yet." />
        </div>
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800 dark:text-white/90 mb-4">Time by Activity</h2>
          <ActivityBarChart data={byActivity} formatValue={formatMinutes} emptyLabel="No sessions in this range yet." />
        </div>
      </div>
    </div>
  );
}
