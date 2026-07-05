/**
 * Raw color swatches only — no semantic meaning here, that's what
 * themes/*.ts are for. Named after the classic-OS reference points so
 * anyone tweaking a theme knows exactly which era/vibe a color came from.
 */
export const PALETTE = {
  // Windows 95/98 chrome
  navy: "#000080",
  teal: "#008080",
  silver: "#C0C0C0",
  silverLight: "#DFDFDF",
  silverDark: "#808080",
  cream: "#F4ECD8",
  black: "#000000",
  white: "#FFFFFF",
  orange: "#FF8C00",

  // CRT terminal
  crtBlack: "#03110A",
  crtGreen: "#33FF66",
  crtGreenDim: "#0F5C2C",
  crtAmber: "#FFB000",

  // Modern light
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate400: "#94A3B8",
  slate600: "#475569",
  slate900: "#0F172A",
  blue500: "#3B82F6",
  blue600: "#2563EB",

  // Shared status colors (consistent across all 3 themes)
  success: "#3FB950",
  warning: "#D9A73E",
  danger: "#E5534B",
} as const;

export type PaletteKey = keyof typeof PALETTE;
