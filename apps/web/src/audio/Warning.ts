import { playSequence } from "./SoundManager";

export function playWarning(): void {
  playSequence([
    { frequency: 500, durationMs: 90, gain: 0.05, type: "sawtooth" },
    { frequency: 500, durationMs: 90, gain: 0.05, type: "sawtooth", delayMs: 130 },
  ]);
}
