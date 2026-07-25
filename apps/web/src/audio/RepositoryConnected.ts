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

export function playRepositoryConnected(): void {
  playSequence([
    { frequency: 523, durationMs: 80, gain: 0.05 },
    { frequency: 659, durationMs: 80, gain: 0.05, delayMs: 80 },
    { frequency: 784, durationMs: 120, gain: 0.05, delayMs: 80 },
  ]);
}
