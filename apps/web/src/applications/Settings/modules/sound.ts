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

// modules/sound.ts — registers volume + mute with Core so they're
// applied consistently at boot alongside every other setting.

import { registerModule } from "../core/SettingsRegistry";
import { setVolume, setMuted } from "../../../audio";

registerModule({
  key: "volume",
  default: 0.5,
  validate: (value: unknown) => typeof value === "number" && value >= 0 && value <= 1,
  apply: (value: number) => setVolume(value),
});

registerModule({
  key: "muted",
  default: false,
  validate: (value: unknown) => typeof value === "boolean",
  apply: (value: boolean) => setMuted(value),
});
