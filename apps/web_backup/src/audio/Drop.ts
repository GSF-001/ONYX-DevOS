/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { playSequence } from "./SoundManager";

export function playDrop(): void {
  playSequence([{ frequency: 300, durationMs: 40, gain: 0.03, type: "triangle" }]);
}
