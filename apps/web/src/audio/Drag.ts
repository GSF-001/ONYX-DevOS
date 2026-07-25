/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { playSequence } from "./SoundManager";

export function playDragStart(): void {
  playSequence([{ frequency: 500, durationMs: 30, gain: 0.02, type: "triangle" }]);
}
