import { playSequence } from "./SoundManager";

export function playHover(): void {
  playSequence([{ frequency: 900, durationMs: 12, gain: 0.015 }]);
}
