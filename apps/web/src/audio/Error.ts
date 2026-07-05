import { playSequence } from "./SoundManager";

export function playError(): void {
  playSequence([
    { frequency: 220, durationMs: 140, gain: 0.06, type: "sawtooth" },
    { frequency: 180, durationMs: 160, gain: 0.06, type: "sawtooth", delayMs: 140 },
  ]);
}
