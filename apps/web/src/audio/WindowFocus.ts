import { playSequence } from "./SoundManager";

export function playWindowFocus(): void {
  playSequence([{ frequency: 660, durationMs: 15, gain: 0.02 }]);
}
