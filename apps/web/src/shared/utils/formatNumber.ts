const compactFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Formats large counts compactly: 1234 -> "1.2K". */
export function formatCompactNumber(value: number): string {
  return compactFormatter.format(value);
}

/** Formats a 0-1 ratio as a percentage string: 0.457 -> "46%". */
export function formatPercent(ratio: number, fractionDigits = 0): string {
  return `${(ratio * 100).toFixed(fractionDigits)}%`;
}

/** Clamps and rounds a score to a clean integer 0-100 for display. */
export function formatScore(score: number): string {
  return String(Math.round(Math.max(0, Math.min(100, score))));
}
