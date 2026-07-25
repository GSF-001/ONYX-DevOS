import { useState } from "react";
import { SettingsSidebar, SettingsSection } from "./SettingsSidebar";

import { AppearancePanel } from "./modules/appearance/AppearancePanel";
import { SoundPanel } from "./modules/sound/SoundPanel";
import { KeyboardPanel } from "./modules/keyboard/KeyboardPanel";

export const SettingsLayout = () => {
  const [active, setActive] = useState<SettingsSection>("appearance");

  const renderPanel = () => {
    switch (active) {
      case "appearance":
        return <AppearancePanel />;
      case "sound":
        return <SoundPanel />;
      case "keyboard":
        return <KeyboardPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="settings-layout">
      <SettingsSidebar active={active} onChange={setActive} />

      <div className="settings-content">
        {renderPanel()}
      </div>
    </div>
  );
};
