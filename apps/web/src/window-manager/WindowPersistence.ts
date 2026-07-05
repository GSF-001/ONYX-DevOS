import type { WindowInstance } from "./WindowContext";

const STORAGE_KEY = "onyx.windowLayout";

export interface PersistedLayout {
  windows: WindowInstance[];
  savedAt: string;
}

export function saveWindowLayout(windows: WindowInstance[]): void {
  const payload: PersistedLayout = { windows, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadWindowLayout(): PersistedLayout | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedLayout;
  } catch {
    return null;
  }
}

export function clearWindowLayout(): void {
  localStorage.removeItem(STORAGE_KEY);
}
