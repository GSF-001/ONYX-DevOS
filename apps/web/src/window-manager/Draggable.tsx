import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";

interface DraggableProps {
  x: number;
  y: number;
  onDrag: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  disabled?: boolean;
  children: (handlers: { onPointerDown: (e: ReactPointerEvent) => void }) => JSX.Element;
}

/**
 * Headless drag primitive: tracks pointer movement and reports the new
 * top-left position. Callers (WindowHeader) render whatever they want and
 * just spread the returned pointer-down handler onto it.
 */
export function Draggable({ x, y, onDrag, onDragEnd, disabled, children }: DraggableProps) {
  const startRef = useRef({ pointerX: 0, pointerY: 0, originX: x, originY: y });
  const currentRef = useRef({ x, y });

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      startRef.current = { pointerX: e.clientX, pointerY: e.clientY, originX: x, originY: y };
      currentRef.current = { x, y };

      const handleMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startRef.current.pointerX;
        const dy = moveEvent.clientY - startRef.current.pointerY;
        const nextX = startRef.current.originX + dx;
        const nextY = Math.max(0, startRef.current.originY + dy);
        currentRef.current = { x: nextX, y: nextY };
        onDrag(nextX, nextY);
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        onDragEnd?.(currentRef.current.x, currentRef.current.y);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [disabled, x, y, onDrag, onDragEnd]
  );

  return children({ onPointerDown: handlePointerDown });
}
