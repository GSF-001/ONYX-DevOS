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

export function playNotification(): void {
  playSequence([
    { frequency: 880, durationMs: 60, gain: 0.05 },
    { frequency: 1174, durationMs: 80, gain: 0.05, delayMs: 60 },
  ]);
}
