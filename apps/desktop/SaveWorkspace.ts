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

import type { WindowInstance } from "../window-manager/WindowContext";
import { upsertWorkspace } from "./WorkspaceManager";

export function saveWorkspace(name: string, windows: WindowInstance[]): void {
  upsertWorkspace({ name, windows, savedAt: new Date().toISOString() });
}
