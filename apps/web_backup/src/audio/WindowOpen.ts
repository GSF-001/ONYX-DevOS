/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { playSequence } from "./SoundManager";

export function playWindowOpen(): void {
  playSequence([
    { frequency: 520, durationMs: 40, gain: 0.04 },
    { frequency: 780, durationMs: 60, gain: 0.04, delayMs: 40 },
  ]);
}
