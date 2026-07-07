/** Format a Date to Chinese locale string (yyyy-MM-dd) */
export function format(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format year only */
export function formatYear(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return '';
  return String(date.getFullYear());
}

/** Format year-month */
export function formatYearMonth(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}年${m}月`;
}

export function formatDateTime(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return '';
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
