import { Themes } from "./Themes";
import type { useSettings } from "./SettingsHooks";

/** Appearance groups theme selection today; density/accent customization
 * would live here too once those exist. */
export function Appearance({ settings }: { settings: ReturnType<typeof useSettings> }) {
  return <Themes settings={settings} />;
}
