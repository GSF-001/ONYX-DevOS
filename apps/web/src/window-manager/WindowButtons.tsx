/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import type { CSSProperties } from "react";

interface WindowButtonsProps {
  onMinimize: () => void;
  onMaximizeToggle: () => void;
  onClose: () => void;
  isMaximized: boolean;
}

const buttonStyle: CSSProperties = {
  width: 18,
  height: 18,
  padding: 0,
  margin: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderTop: "2px solid #fff",
  borderLeft: "2px solid #fff",
  borderRight: "2px solid #555",
  borderBottom: "2px solid #555",
  background: "#c0c0c0",
  color: "#000",
  fontSize: 10,
  fontWeight: "bold",
  cursor: "pointer",
};

export function WindowButtons({
  onMinimize,
  onMaximizeToggle,
  onClose,
  isMaximized,
}: WindowButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
      }}
    >
      <button
        type="button"
        style={buttonStyle}
        aria-label="Minimize"
        onClick={onMinimize}
      >
        _
      </button>

      <button
        type="button"
        style={buttonStyle}
        aria-label={isMaximized ? "Restore" : "Maximize"}
        onClick={onMaximizeToggle}
      >
        {isMaximized ? "❐" : "□"}
      </button>

      <button
        type="button"
        style={buttonStyle}
        aria-label="Close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
