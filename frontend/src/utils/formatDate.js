/**
 * Format a date string or Date object into a human-readable format.
 * @param {string|Date} date
 * @param {object} options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'Invalid date';

  const {
    weekday = false,
    year = 'numeric',
    month = 'short',
    day = 'numeric',
  } = options;

  return new Intl.DateTimeFormat('en-US', {
    weekday: weekday ? 'long' : undefined,
    year,
    month,
    day,
  }).format(d);
}

/**
 * Format a date as YYYY-MM-DD (for input fields).
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateInput(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get relative time string (e.g. "2 hours ago").
 * @param {string|Date} date
 * @returns {string}
 */
export function timeAgo(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}
