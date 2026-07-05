export interface BootStep {
  id: string;
  label: string;
  durationMs: number;
}

/** The fixed sequence of checks shown on the boot screen. Durations are
 * cosmetic pacing, not real measurements of anything. */
export const BOOT_SEQUENCE: BootStep[] = [
  { id: "core", label: "Loading Core System", durationMs: 500 },
  { id: "window-manager", label: "Initializing Window Manager", durationMs: 400 },
  { id: "github", label: "Connecting to GitHub", durationMs: 700 },
  { id: "repository-data", label: "Loading Repository Data", durationMs: 600 },
  { id: "live-sync", label: "Starting Live Sync", durationMs: 450 },
];

export const BOOT_READY_MESSAGE = "SYSTEM READY.";
export const BOOT_WELCOME_MESSAGE = "Welcome back, engineer.";
