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

const ACTIVE_GROUP_KEY = "onyx.activeGroupId";

export function getActiveGroupId(): number | null {
  const raw = localStorage.getItem(ACTIVE_GROUP_KEY);
  return raw ? Number(raw) : null;
}

export function setActiveGroupId(id: number): void {
  localStorage.setItem(ACTIVE_GROUP_KEY, String(id));
}
