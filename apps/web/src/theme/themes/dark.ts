/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { PALETTE } from "../palette";
import { FONT_FAMILIES } from "../typography";
import type { Theme } from "../tokens";

/** "Dark" — dark slate variant, modern chrome but low-light. */
export const darkTheme: Theme = {
  id: "dark",
  label: "Dark",
  colors: {
    titleBarActive: PALETTE.slate900,
    titleBarInactive: "#1E293B",
    titleBarText: PALETTE.slate50,
    titleBarTextInactive: PALETTE.slate400,
    windowFace: "#1E293B",
    windowFaceLight: "#334155",
    windowFaceDark: PALETTE.slate900,
    windowBorder: "#000000",
    desktopBackground: "#0B1120",
    fieldBackground: "#111827",
    text: PALETTE.slate50,
    textDim: PALETTE.slate400,
    accent: PALETTE.blue500,
    success: PALETTE.success,
    warning: PALETTE.warning,
    danger: PALETTE.danger,
  },
  fonts: { ui: FONT_FAMILIES.ui, mono: FONT_FAMILIES.mono },
  radius: 6,
};
