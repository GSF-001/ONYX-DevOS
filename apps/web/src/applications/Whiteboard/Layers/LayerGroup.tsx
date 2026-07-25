/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Layers/LayerGroup.tsx

import React from "react";
import { Layer } from "../WhiteboardTypes";

interface LayerGroupProps {
  groupName: string;
  layers: Layer[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
  children: React.ReactNode;
}

export const LayerGroup: React.FC<LayerGroupProps> = ({
  groupName,
  layers,
  collapsed,
  onToggleCollapsed,
  children,
}) => {
  return (
    <div className="wb-layer-group" style={{ marginBottom: 6 }}>
      <div
        onClick={onToggleCollapsed}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 8px",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
          color: "#5c6270",
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        <span style={{ transform: collapsed ? "rotate(-90deg)" : "none", display: "inline-block" }}>
          ▾
        </span>
        <span>{groupName}</span>
        <span style={{ fontWeight: 400, color: "#9aa0ac" }}>({layers.length})</span>
      </div>
      {!collapsed && <div className="wb-layer-group__children">{children}</div>}
    </div>
  );
};

export default LayerGroup;
