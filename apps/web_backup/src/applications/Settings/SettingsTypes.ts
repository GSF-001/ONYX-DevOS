/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

export interface NotificationPrefs {
  desktopToasts: boolean;
  sound: boolean;
}

export interface SettingsState {
  themeId: string;
  volume: number;
  muted: boolean;
  notifications: NotificationPrefs;
  autosaveWorkspace: boolean;
}
