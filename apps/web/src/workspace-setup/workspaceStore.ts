/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

const ACTIVE_TEAM_SLUG_KEY = "onyx.activeTeamSlug";

export function getActiveTeamSlug(): string | null {
  return localStorage.getItem(ACTIVE_TEAM_SLUG_KEY);
}

export function setActiveTeamSlug(slug: string): void {
  localStorage.setItem(ACTIVE_TEAM_SLUG_KEY, slug);
}
