import { useState } from "react";
import { StartButton } from "./StartButton";
import { StartMenu } from "./StartMenu";
import { QuickLaunch } from "./QuickLaunch";
import { RunningApps } from "./RunningApps";
import { Tray } from "./Tray";
import { useWindowManager } from "../window-manager";
import { TOKENS } from "../theme";

export function Taskbar() {
  const manager = useWindowManager();
  const [startOpen, setStartOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: TOKENS.desktop.taskbarHeight,
        background: "var(--win-face)",
        borderTop: "2px solid var(--win-face-light)",
        display: "flex",
        alignItems: "stretch",
        gap: 6,
        padding: "0 4px",
        zIndex: TOKENS.zIndex.contextMenu - 100,
      }}
    >
      <div style={{ position: "relative" }}>
        <StartButton isOpen={startOpen} onToggle={() => setStartOpen((o) => !o)} />
        {startOpen && (
          <StartMenu onOpenApp={manager.open} onClose={() => setStartOpen(false)} />
        )}
      </div>

      <QuickLaunch onOpenApp={manager.open} />

      <RunningApps
        windows={manager.windows}
        focusedId={manager.focusedId}
        onSelect={(id, isFocused, isMinimized) => {
          if (isMinimized) manager.restore(id);
          else if (isFocused) manager.minimize(id);
          else manager.focus(id);
        }}
      />

      <Tray />
    </div>
  );
}
