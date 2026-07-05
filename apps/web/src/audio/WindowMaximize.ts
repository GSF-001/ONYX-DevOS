import { playSequence } from "./SoundManager";

export function playWindowMaximize(): void {
  playSequence([{ frequency: 400, durationMs: 30, gain: 0.03 }, { frequency: 700, durationMs: 40, gain: 0.03, delayMs: 30 }]);
}
