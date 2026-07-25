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

// ShortcutsFlag.ts — module-level toggle checked by useWindowShortcuts,
// driven by the Settings "shortcutsEnabled" module.

let enabled = true;

export function getShortcutsEnabled(): boolean {
  return enabled;
}

export function setShortcutsEnabled(value: boolean): void {
  enabled = value;
}
