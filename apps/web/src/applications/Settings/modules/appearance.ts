/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// modules/appearance.ts — registers the accent-color setting with Core.
// Theme (light/dark/crt/etc) is already handled by ThemeProvider itself;
// this module fixes the gap where accent color picked in Themes.tsx was
// never persisted and reset on every reload.

import { registerModule } from "../core/SettingsRegistry";

const DEFAULT_ACCENT = "#FF8C00";

function isValidHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

registerModule({
  key: "accentColor",
  default: DEFAULT_ACCENT,
  validate: isValidHexColor,
  apply: (value: string) => {
    document.documentElement.style.setProperty("--win-accent", value);
  },
});
