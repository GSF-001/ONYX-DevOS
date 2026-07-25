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

// modules/workspace.ts — registers "autosaveWorkspace" with Core, kept in
// sync with the existing SettingsStore flag used by Workspace.tsx.

import { registerModule } from "../core/SettingsRegistry";
import { setAutosaveWorkspace } from "../SettingsStore";

registerModule({
  key: "autosaveWorkspace",
  default: true,
  validate: (value: unknown) => typeof value === "boolean",
  apply: (value: boolean) => setAutosaveWorkspace(value),
});
