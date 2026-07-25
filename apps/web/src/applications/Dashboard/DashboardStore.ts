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

const ACTIVE_REPO_KEY = "onyx.activeRepositoryId";
const ACTIVE_TEAM_SLUG_KEY = "onyx.activeTeamSlug";

/**
 * The "which repository is currently selected" bit is small enough not to
 * warrant a full context provider — persisted to localStorage so it
 * survives a refresh/reboot, read by every app window that needs to know
 * "which repo am I looking at".
 */
export function getActiveRepositoryId(): number | null {
  const raw = localStorage.getItem(ACTIVE_REPO_KEY);
  return raw ? Number(raw) : null;
}

export function setActiveRepositoryId(id: number): void {
  localStorage.setItem(ACTIVE_REPO_KEY, String(id));
}

/** The active team/workspace slug, set once during onboarding
 * (create-workspace) and read by the dashboard instead of a hardcoded
 * "demo-team" placeholder. */
export function getActiveTeamSlug(): string | null {
  return localStorage.getItem(ACTIVE_TEAM_SLUG_KEY);
}

export function setActiveTeamSlug(slug: string): void {
  localStorage.setItem(ACTIVE_TEAM_SLUG_KEY, slug);
}
