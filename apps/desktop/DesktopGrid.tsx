import { DesktopIcon } from "./DesktopIcon";
import type { IconPosition } from "./DesktopState";

interface DesktopGridProps {
  positions: IconPosition[];
  selectedAppId: string | null;
  renamingAppId: string | null;
  onSelect: (appId: string) => void;
  onOpen: (appId: string) => void;
  onMove: (appId: string, x: number, y: number) => void;
  onRename: (appId: string, label: string) => void;
  onIconContextMenu: (appId: string, e: React.MouseEvent) => void;
}

export function DesktopGrid({
  positions,
  selectedAppId,
  renamingAppId,
  onSelect,
  onOpen,
  onMove,
  onRename,
  onIconContextMenu,
}: DesktopGridProps) {
  return (
    <>
      {positions.map((position) => (
        <DesktopIcon
          key={position.appId}
          position={position}
          isSelected={selectedAppId === position.appId}
          isRenaming={renamingAppId === position.appId}
          onSelect={() => onSelect(position.appId)}
          onOpen={() => onOpen(position.appId)}
          onMove={(x, y) => onMove(position.appId, x, y)}
          onRename={(label) => onRename(position.appId, label)}
          onContextMenu={(e) => onIconContextMenu(position.appId, e)}
        />
      ))}
    </>
  );
}
