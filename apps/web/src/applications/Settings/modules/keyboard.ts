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

// modules/keyboard.ts — registers the "shortcutsEnabled" toggle with Core.
// Wired into useWindowShortcuts via the shared ShortcutsFlag module.

import { registerModule } from "../core/SettingsRegistry";
import { setShortcutsEnabled } from "../../../window-manager";

registerModule({
  key: "shortcutsEnabled",
  default: true,
  validate: (value: unknown) => typeof value === "boolean",
  apply: (value: boolean) => setShortcutsEnabled(value),
});
