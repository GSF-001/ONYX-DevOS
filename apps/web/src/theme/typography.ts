/**
 * Font stacks per role. Real "MS Sans Serif"/"Fixedsys" aren't web fonts —
 * we fall back to close-enough system/web equivalents rather than shipping
 * font files, since the retro *feel* comes as much from chrome/spacing as
 * from the exact glyphs.
 */
export const FONT_FAMILIES = {
  ui: `"Tahoma", "Segoe UI", "MS Sans Serif", sans-serif`,
  mono: `"Fixedsys", "Consolas", "Courier New", monospace`,
  pixel: `"Perfect DOS VGA 437", "Courier New", monospace`,
} as const;

export const TYPE_SCALE = {
  xs: "11px",
  sm: "12px",
  base: "13px",
  md: "14px",
  lg: "16px",
  xl: "20px",
  xxl: "28px",
} as const;

export const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.45,
} as const;
