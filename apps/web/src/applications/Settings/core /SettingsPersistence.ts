const STORAGE_KEY = "onyx_settings_v2";

export type PersistedSettings = Record<string, any>;

export const loadSettings = (): PersistedSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveSettings = (settings: PersistedSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
};
