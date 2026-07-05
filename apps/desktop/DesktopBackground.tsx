interface DesktopBackgroundProps {
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

/**
 * The click-catching backdrop layer — clicking empty desktop space
 * deselects icons; right-clicking opens the desktop context menu. Actual
 * visual background comes from the theme's `--win-desktop-bg` token
 * already applied to `.win-desktop` in theme/index.tsx.
 */
export function DesktopBackground({ onClick, onContextMenu }: DesktopBackgroundProps) {
  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e);
      }}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    />
  );
}
