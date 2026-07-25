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

import { useSettings } from "./SettingsHooks";
import { SettingsWindow } from "./SettingsWindow";
import "./SettingsStyles.css";

export default function SettingsApp() {
  const settings = useSettings();
  return <SettingsWindow settings={settings} />;
}
