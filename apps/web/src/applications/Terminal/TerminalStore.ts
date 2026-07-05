const STORAGE_KEY = "onyx.terminalHistory";
const MAX_ENTRIES = 200;

/** Persists command-line history across sessions (real feature — arrow-key
 * history in terminal/Terminal.tsx is in-memory only within one mount;
 * this lets it survive a reboot/reload). */
export function loadPersistedHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function appendPersistedHistory(command: string): void {
  const history = [...loadPersistedHistory(), command].slice(-MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearPersistedHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
