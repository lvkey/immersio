import { Flame, Trophy, CalendarCheck } from 'lucide-react';

function StatBlock({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
      <div className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-lg ${accent}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800 dark:text-white/90 tabular-nums">{value}</div>
        <div className="text-xs text-slate-500 dark:text-white/50">{label}</div>
      </div>
    </div>
  );
}

export function StreakCard({ currentStreak, longestStreak, daysLogged }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatBlock
        icon={Flame}
        label="Current Streak"
        value={`${currentStreak} day${currentStreak === 1 ? '' : 's'}`}
        accent="bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400"
      />
      <StatBlock
        icon={Trophy}
        label="Longest Streak"
        value={`${longestStreak} day${longestStreak === 1 ? '' : 's'}`}
        accent="bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400"
      />
      <StatBlock
        icon={CalendarCheck}
        label="Days Logged"
        value={daysLogged}
        accent="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
      />
    </div>
  );
}
