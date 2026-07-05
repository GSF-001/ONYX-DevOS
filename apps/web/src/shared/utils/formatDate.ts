const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * Formats an ISO date string as a relative time ("3 days ago"). Falls back
 * to "just now" for anything under a minute.
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffSeconds = (date.getTime() - Date.now()) / 1000;

  for (const [unit, secondsInUnit] of UNITS) {
    if (Math.abs(diffSeconds) >= secondsInUnit) {
      return rtf.format(Math.round(diffSeconds / secondsInUnit), unit);
    }
  }
  return "just now";
}

/**
 * Formats an ISO date string for display in tables/tooltips, e.g.
 * "Jul 5, 2026, 14:32".
 */
export function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
