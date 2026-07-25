// Canvas/Zoom.tsx

import React from "react";

interface ZoomProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFitToScreen: () => void;
}

export const Zoom: React.FC<ZoomProps> = ({ zoom, onZoomIn, onZoomOut, onReset, onFitToScreen }) => {
  return (
    <div
      className="wb-zoom-controls"
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "#ffffff",
        border: "1px solid #e6e8ec",
        borderRadius: 8,
        padding: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        zIndex: 20,
      }}
    >
      <button onClick={onZoomOut} title="Zoom out" style={btnStyle}>
        –
      </button>
      <button
        onClick={onReset}
        title="Reset zoom"
        style={{ ...btnStyle, width: 56, fontSize: 12 }}
      >
        {Math.round(zoom * 100)}%
      </button>
      <button onClick={onZoomIn} title="Zoom in" style={btnStyle}>
        +
      </button>
      <div style={{ width: 1, height: 20, background: "#e6e8ec", margin: "0 4px" }} />
      <button onClick={onFitToScreen} title="Fit to screen" style={{ ...btnStyle, width: 32 }}>
        ⤢
      </button>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  width: 28,
  height: 28,
  borderRadius: 6,
  fontSize: 16,
  color: "#3a3f4a",
};

export default Zoom;
