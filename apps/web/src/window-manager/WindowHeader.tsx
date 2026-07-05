import { Draggable } from "./Draggable";

interface WindowHeaderProps {
  title: string;
  icon?: string;
  x: number;
  y: number;
  isFocused: boolean;
  isMaximized: boolean;
  onDrag: (x: number, y: number) => void;
  onDoubleClick: () => void;
  buttons: React.ReactNode;
}

export function WindowHeader({
  title,
  x,
  y,
  isFocused,
  isMaximized,
  onDrag,
  onDoubleClick,
  buttons,
}: WindowHeaderProps) {
  return (
    <Draggable x={x} y={y} onDrag={onDrag} disabled={isMaximized}>
      {({ onPointerDown }) => (
        <div
          className={`win-titlebar${isFocused ? "" : " inactive"}`}
          onPointerDown={onPointerDown}
          onDoubleClick={onDoubleClick}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </span>
          {buttons}
        </div>
      )}
    </Draggable>
  );
}
