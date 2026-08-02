export const LANGUAGE_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#22c55e', // green
  '#f59e0b', // amber
  '#a855f7', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
];

export function nextColor(existingCount) {
  return LANGUAGE_COLORS[existingCount % LANGUAGE_COLORS.length];
}
