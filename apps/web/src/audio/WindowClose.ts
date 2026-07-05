import { playSequence } from "./SoundManager";

export function playWindowClose(): void {
  playSequence([
    { frequency: 780, durationMs: 40, gain: 0.04 },
    { frequency: 420, durationMs: 60, gain: 0.04, delayMs: 40 },
  ]);
}
