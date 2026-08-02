import { Trash2 } from 'lucide-react';
import { ACTIVITY_BY_ID } from '../lib/activityTypes';
import { formatMinutes, formatShortDate } from '../lib/format';

export function LogList({ logs, languagesById, onDelete }) {
  if (logs.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm text-sm text-slate-500 dark:text-white/50 text-center py-10">
        No sessions logged yet. Your first one will show up here.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm divide-y divide-slate-100 dark:divide-white/10">
      {logs.map((log) => {
        const activity = ACTIVITY_BY_ID[log.activity];
        const language = languagesById.get(log.language_id);
        const Icon = activity?.icon;
        return (
          <div key={log.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/60">
              {Icon && <Icon size={15} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-white/90">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: language?.color ?? '#94a3b8' }}
                />
                <span className="truncate">{language?.name ?? 'Unknown language'}</span>
                <span className="text-slate-300 dark:text-white/20">&middot;</span>
                <span className="text-slate-500 dark:text-white/50 truncate">{activity?.label ?? log.activity}</span>
              </div>
              {log.note && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-white/50 truncate">{log.note}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-semibold text-slate-700 dark:text-white/90 tabular-nums">
                {formatMinutes(log.minutes)}
              </div>
              <div className="text-xs text-slate-400 dark:text-white/40">{formatShortDate(log.log_date)}</div>
            </div>
            <button
              type="button"
              onClick={() => onDelete(log.id)}
              title="Delete entry"
              className="flex items-center justify-center w-7 h-7 shrink-0 rounded-md text-slate-300 dark:text-white/20 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
