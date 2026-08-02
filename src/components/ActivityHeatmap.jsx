import { useState } from 'react';
import { toISODate, formatMinutes } from '../lib/format';

const WEEKS = 14;

function buildCells(minutesByDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Align the grid so the last column ends on today, weeks running Sun-Sat.
  const end = new Date(today);
  const endDow = end.getDay();
  const start = new Date(end);
  start.setDate(start.getDate() - endDow - (WEEKS - 1) * 7);

  const cells = [];
  const cursor = new Date(start);
  for (let i = 0; i < WEEKS * 7; i += 1) {
    const iso = toISODate(cursor);
    cells.push({ iso, minutes: minutesByDate.get(iso) ?? 0, isFuture: cursor > today });
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
}

function intensityClass(minutes) {
  if (minutes <= 0) return 'bg-slate-100 dark:bg-white/5';
  if (minutes < 15) return 'bg-blue-200 dark:bg-blue-900';
  if (minutes < 30) return 'bg-blue-300 dark:bg-blue-700';
  if (minutes < 60) return 'bg-blue-500 dark:bg-blue-500';
  return 'bg-blue-700 dark:bg-blue-400';
}

export function ActivityHeatmap({ minutesByDate }) {
  const [hovered, setHovered] = useState(null);
  const cells = buildCells(minutesByDate);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell) => (
              <div
                key={cell.iso}
                onMouseEnter={() => setHovered(cell)}
                onMouseLeave={() => setHovered((h) => (h?.iso === cell.iso ? null : h))}
                className={`w-3.5 h-3.5 rounded-sm ${cell.isFuture ? 'invisible' : intensityClass(cell.minutes)}`}
              />
            ))}
          </div>
        ))}
      </div>
      {hovered && (
        <div className="mt-2 text-xs text-slate-500 dark:text-white/50">
          {hovered.iso}: {hovered.minutes > 0 ? formatMinutes(hovered.minutes) : 'no sessions'}
        </div>
      )}
    </div>
  );
}
