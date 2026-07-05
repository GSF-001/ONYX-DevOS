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
