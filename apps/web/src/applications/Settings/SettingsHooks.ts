import { useCallback, useState } from "react";
import { useTheme } from "../../theme";
import { getVolume, setVolume, isMuted, setMuted } from "../../audio";
import {
  getAutosaveWorkspace,
  getNotificationPrefs,
  setAutosaveWorkspace,
  setNotificationPrefs,
} from "./SettingsStore";
import type { NotificationPrefs } from "./SettingsTypes";

export function useSettings() {
  const { theme, themeId, setThemeId, themes } = useTheme();

  const [volume, setVolumeState] = useState(getVolume());
  const [muted, setMutedState] = useState(isMuted());
  const [notifications, setNotifications] = useState<NotificationPrefs>(getNotificationPrefs());
  const [autosave, setAutosaveState] = useState(getAutosaveWorkspace());

  const updateVolume = useCallback((value: number) => {
    setVolume(value);
    setVolumeState(value);
  }, []);

  const toggleMuted = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  }, [muted]);

  const updateNotifications = useCallback((prefs: NotificationPrefs) => {
    setNotificationPrefs(prefs);
    setNotifications(prefs);
  }, []);

  const updateAutosave = useCallback((value: boolean) => {
    setAutosaveWorkspace(value);
    setAutosaveState(value);
  }, []);

  return {
    theme,
    themeId,
    setThemeId,
    themes,
    volume,
    updateVolume,
    muted,
    toggleMuted,
    notifications,
    updateNotifications,
    autosave,
    updateAutosave,
  };
}
