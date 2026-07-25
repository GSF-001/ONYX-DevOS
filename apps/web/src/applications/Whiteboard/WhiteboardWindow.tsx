/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// WhiteboardWindow.tsx

import React, { useCallback, useRef, useState } from "react";

interface WhiteboardWindowProps {
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
}

export const WhiteboardWindow: React.FC<WhiteboardWindowProps> = ({
  title = "Whiteboard",
  children,
  onClose,
  initialWidth = 1100,
  initialHeight = 720,
  initialX = 80,
  initialY = 60,
}) => {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [maximized, setMaximized] = useState(false);
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const resizeState = useRef<{ startX: number; startY: number; originW: number; originH: number } | null>(null);

  const handleTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (maximized) return;
      dragState.current = { startX: e.clientX, startY: e.clientY, originX: pos.x, originY: pos.y };
    },
    [maximized, pos]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragState.current) {
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      setPos({ x: dragState.current.originX + dx, y: dragState.current.originY + dy });
    }
    if (resizeState.current) {
      const dx = e.clientX - resizeState.current.startX;
      const dy = e.clientY - resizeState.current.startY;
      setSize({
        width: Math.max(480, resizeState.current.originW + dx),
        height: Math.max(360, resizeState.current.originH + dy),
      });
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
    resizeState.current = null;
  }, []);

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      resizeState.current = { startX: e.clientX, startY: e.clientY, originW: size.width, originH: size.height };
    },
    [size]
  );

  const windowStyle: React.CSSProperties = maximized
    ? { position: "fixed", inset: 0, borderRadius: 0 }
    : {
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        borderRadius: 12,
      };

  return (
    <div
      className="wb-window"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        ...windowStyle,
        background: "#ffffff",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      <div
        className="wb-window__titlebar"
        onPointerDown={handleTitlePointerDown}
        style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          background: "#f7f8fa",
          borderBottom: "1px solid #e6e8ec",
          cursor: maximized ? "default" : "grab",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 8, marginRight: 12 }}>
          <button
            onClick={onClose}
            title="Close"
            style={{ ...dotStyle, background: "#ff5f57" }}
          />
          <button
            onClick={() => setMaximized(false)}
            title="Minimize"
            style={{ ...dotStyle, background: "#febc2e" }}
          />
          <button
            onClick={() => setMaximized((m) => !m)}
            title={maximized ? "Restore" : "Maximize"}
            style={{ ...dotStyle, background: "#28c840" }}
          />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#3a3f4a" }}>{title}</span>
      </div>

      <div className="wb-window__body" style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {children}
      </div>

      {!maximized && (
        <div
          onPointerDown={handleResizePointerDown}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            cursor: "nwse-resize",
          }}
        />
      )}
    </div>
  );
};

const dotStyle: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

export default WhiteboardWindow;
