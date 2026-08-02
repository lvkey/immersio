import { useState } from 'react';

const ROW_TEMPLATE = 'minmax(90px, 200px) 1fr minmax(56px, 80px)';

export function ActivityBarChart({ data, formatValue, emptyLabel }) {
  const [hoveredId, setHoveredId] = useState(null);
  const rows = [...data].sort((a, b) => b.value - a.value);

  if (rows.length === 0) {
    return <div className="py-8 text-center text-sm text-slate-500 dark:text-white/50">{emptyLabel}</div>;
  }

  const maxValue = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="grid gap-y-2.5 w-full min-w-0" style={{ gridTemplateColumns: ROW_TEMPLATE }}>
      {rows.map((item) => {
        const pct = (item.value / maxValue) * 100;
        const isHovered = hoveredId === item.id;
        return (
          <div className="contents" key={item.id}>
            <div className="flex min-w-0 items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-white/80">
              {item.color && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />}
              <span className="truncate">{item.label}</span>
            </div>
            <div
              className="relative h-5 self-center rounded bg-slate-100 dark:bg-white/5 min-w-0"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId((id) => (id === item.id ? null : id))}
            >
              <div
                className="h-full rounded-r transition-colors"
                style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: isHovered ? item.color ?? '#2563eb' : item.color ?? '#3b82f6' }}
              />
            </div>
            <div className="self-center text-right text-xs sm:text-sm font-semibold text-slate-700 dark:text-white/90 tabular-nums truncate">
              {formatValue(item.value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
