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

export function playWindowMaximize(): void {
  playSequence([{ frequency: 400, durationMs: 30, gain: 0.03 }, { frequency: 700, durationMs: 40, gain: 0.03, delayMs: 30 }]);
}
