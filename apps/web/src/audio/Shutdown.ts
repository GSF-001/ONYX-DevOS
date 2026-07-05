import { playSequence } from "./SoundManager";

export function playShutdownChime(): void {
  playSequence([
    { frequency: 880, durationMs: 100, gain: 0.05 },
    { frequency: 660, durationMs: 120, gain: 0.05, delayMs: 100 },
    { frequency: 440, durationMs: 200, gain: 0.05, delayMs: 120 },
  ]);
}
