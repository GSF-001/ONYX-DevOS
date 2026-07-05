import { useNavigate } from "react-router-dom";
import { useCommandPalette } from "./useCommandPalette";
import { CommandSearch } from "./CommandSearch";
import { useWindowManager } from "../window-manager";
import { TOKENS } from "../theme";

/**
 * Mount once near the root of the desktop. Owns its own Ctrl/Cmd+K listener
 * via useCommandPalette, so no other component needs to know it exists.
 */
export function CommandPalette() {
  const navigate = useNavigate();
  const windowManager = useWindowManager();

  const palette = useCommandPalette({
    openApp: windowManager.open,
    navigate: (path) => navigate(path),
  });

  if (!palette.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal
      onClick={palette.close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
        zIndex: TOKENS.zIndex.contextMenu,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="win-frame"
        style={{ width: 480, maxWidth: "90vw" }}
      >
        <CommandSearch
          query={palette.query}
          onQueryChange={palette.setQuery}
          results={palette.results}
          activeIndex={palette.activeIndex}
          onActiveIndexChange={palette.setActiveIndex}
          onRun={(command) => {
            command.run();
            palette.close();
          }}
        />
      </div>
    </div>
  );
}
