/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { playSequence } from "./SoundManager";

export function playClick(): void {
  playSequence([{ frequency: 1200, durationMs: 20, gain: 0.03 }]);
}
