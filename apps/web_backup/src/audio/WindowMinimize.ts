/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { playSequence } from "./SoundManager";

export function playWindowMinimize(): void {
  playSequence([{ frequency: 600, durationMs: 30, gain: 0.03, delayMs: 20 }, { frequency: 300, durationMs: 40, gain: 0.03 }]);
}
