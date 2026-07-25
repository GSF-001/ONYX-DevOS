/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { playSequence } from "./SoundManager";

export function playHover(): void {
  playSequence([{ frequency: 900, durationMs: 12, gain: 0.015 }]);
}
