/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { playSequence } from "./SoundManager";

/** Very quiet, short blip — meant to be barely noticeable, played on every
 * websocket message so live updates feel alive without being annoying. */
export function playLiveSyncTick(): void {
  playSequence([{ frequency: 1400, durationMs: 8, gain: 0.008 }]);
}
