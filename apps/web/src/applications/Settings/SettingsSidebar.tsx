/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */


import React from "react";

export type SettingsSection =
  | "appearance"
  | "sound"
  | "keyboard";

type Props = {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
};

const items: { key: SettingsSection; label: string }[] = [
  { key: "appearance", label: "Appearance" },
  { key: "sound", label: "Sound" },
  { key: "keyboard", label: "Keyboard" },
];

export const SettingsSidebar = ({ active, onChange }: Props) => {
  return (
    <div className="settings-sidebar">
      {items.map((item) => {
        const isActive = active === item.key;

        return (
          <div
            key={item.key}
            className={`settings-sidebar-item ${
              isActive ? "settings-nav-active" : ""
            }`}
            onClick={() => onChange(item.key)}
          >
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
