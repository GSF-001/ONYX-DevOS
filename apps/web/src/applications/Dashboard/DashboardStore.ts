const ACTIVE_REPO_KEY = "onyx.activeRepositoryId";

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
