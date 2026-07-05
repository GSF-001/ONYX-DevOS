import { playSequence } from "./SoundManager";

export function playRepositoryDisconnected(): void {
  playSequence([
    { frequency: 784, durationMs: 80, gain: 0.05 },
    { frequency: 523, durationMs: 120, gain: 0.05, delayMs: 80 },
  ]);
}
