import { useState } from "react";
import { DesktopLayout } from "./DesktopLayout";
import { DesktopBackground } from "./DesktopBackground";
import { DesktopGrid } from "./DesktopGrid";
import { ContextMenu, type ContextMenuAction } from "./ContextMenu";
import { useDesktopState } from "./DesktopState";
import { WorkspaceLoadedToast } from "./WorkspaceLoadedToast";
import { loadWorkspace } from "./LoadWorkspace";
import {
  WindowManager,
  useWindowManager,
  useWindowContext,
  WINDOW_REGISTRY,
  saveWindowLayout,
} from "../window-manager";
import { Taskbar } from "../taskbar";
import { CommandPalette } from "../command-palette";
import { NotificationManager, Popup, LiveNotification } from "../notifications";
import { ThemeProvider } from "../theme";

const APP_IDS = Object.keys(WINDOW_REGISTRY);
const APP_LABELS = Object.fromEntries(APP_IDS.map((id) => [id, WINDOW_REGISTRY[id].title]));

function DesktopInner() {
  const manager = useWindowManager();
  const { dispatch } = useWindowContext();
  const desktop = useDesktopState(APP_IDS, APP_LABELS);
  const [menu, setMenu] = useState<{ x: number; y: number; actions: ContextMenuAction[] } | null>(null);
  const [loadedWorkspaceName, setLoadedWorkspaceName] = useState<string | null>(null);

  const openDesktopMenu = (e: React.MouseEvent) => {
    setMenu({
      x: e.clientX,
      y: e.clientY,
      actions: [
        { label: "Refresh", onSelect: () => window.location.reload() },
        { divider: true, label: "", onSelect: () => undefined },
        { label: "Save current layout...", onSelect: () => manager.open("settings") },
        { label: "Reset icon layout", onSelect: desktop.resetLayout },
        { divider: true, label: "", onSelect: () => undefined },
        { label: "Desktop Settings...", onSelect: () => manager.open("settings") },
      ],
    });
  };

  const openIconMenu = (appId: string, e: React.MouseEvent) => {
    setMenu({
      x: e.clientX,
      y: e.clientY,
      actions: [
        { label: "Open", onSelect: () => manager.open(appId) },
        { label: "Rename", onSelect: () => desktop.setRenamingAppId(appId) },
        { divider: true, label: "", onSelect: () => undefined },
        {
          label: "Save layout snapshot",
          onSelect: () => saveWindowLayout(manager.windows),
        },
      ],
    });
  };

  return (
    <DesktopLayout
      background={
        <DesktopBackground onClick={() => desktop.setSelectedAppId(null)} onContextMenu={openDesktopMenu} />
      }
      icons={
        <DesktopGrid
          positions={desktop.positions}
          selectedAppId={desktop.selectedAppId}
          renamingAppId={desktop.renamingAppId}
          onSelect={desktop.setSelectedAppId}
          onOpen={manager.open}
          onMove={desktop.movePosition}
          onRename={desktop.renameIcon}
          onIconContextMenu={openIconMenu}
        />
      }
      windows={<WindowManager />}
      taskbar={<Taskbar />}
      overlays={
        <>
          <CommandPalette />
          <Popup />
          <LiveNotification />
          <WorkspaceLoadedToast workspaceName={loadedWorkspaceName} onDismiss={() => setLoadedWorkspaceName(null)} />
          {menu && <ContextMenu x={menu.x} y={menu.y} actions={menu.actions} onClose={() => setMenu(null)} />}
        </>
      }
    />
  );
}

/**
 * Top-level desktop composition — the real replacement for the temporary
 * DesktopIconGrid stand-in in pages/DesktopPage.tsx. Mounts the theme,
 * notification store, and window manager exactly once, wires the desktop
 * icon grid to real drag/rename/context-menu behavior, and renders the
 * taskbar + command palette + live notifications alongside it.
 */
export function Desktop() {
  return (
    <ThemeProvider>
      <NotificationManager>
        <WindowManagerRoot />
      </NotificationManager>
    </ThemeProvider>
  );
}

/** Splits out because DesktopInner needs useWindowContext/useWindowManager,
 * which only exist inside WindowManager's own provider. */
function WindowManagerRoot() {
  return (
    <WindowProviderBoundary />
  );
}

function WindowProviderBoundary() {
  const { WindowContextProvider } = require("../window-manager/WindowContext") as typeof import("../window-manager/WindowContext");
  return (
    <WindowContextProvider>
      <DesktopInner />
    </WindowContextProvider>
  );
}
