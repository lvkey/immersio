import { toISODate } from './format';

// Consecutive-day streak counting back from today. Today doesn't have to be
// logged yet for the streak to still be "alive" - it just doesn't count
// until a session is logged, matching how habit-streak trackers usually work.
export function computeCurrentStreak(logDates) {
  const dates = new Set(logDates);
  const cursor = new Date();
  if (!dates.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dates.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeLongestStreak(logDates) {
  const sorted = [...new Set(logDates)].sort();
  if (sorted.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00`);
    const curr = new Date(`${sorted[i]}T00:00:00`);
    const dayDiff = Math.round((curr - prev) / 86400000);
    current = dayDiff === 1 ? current + 1 : 1;
    longest = Math.max(longest, current);
  }
  return longest;
}
