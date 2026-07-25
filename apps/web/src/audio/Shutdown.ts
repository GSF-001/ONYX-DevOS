/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { playSequence } from "./SoundManager";

export function playShutdownChime(): void {
  playSequence([
    { frequency: 880, durationMs: 100, gain: 0.05 },
    { frequency: 660, durationMs: 120, gain: 0.05, delayMs: 100 },
    { frequency: 440, durationMs: 200, gain: 0.05, delayMs: 120 },
  ]);
}
