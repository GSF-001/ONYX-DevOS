/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Layers/LayerItem.tsx

import React, { useState } from "react";
import { Layer } from "../WhiteboardTypes";

interface LayerItemProps {
  layer: Layer;
  isActive: boolean;
  objectCount: number;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  isActive,
  objectCount,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onRename,
  onDelete,
}) => {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(layer.name);

  const commitRename = () => {
    setEditing(false);
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== layer.name) {
      onRename(layer.id, trimmed);
    } else {
      setDraftName(layer.name);
    }
  };

  return (
    <div
      className={`wb-layer-item${isActive ? " wb-layer-item--active" : ""}`}
      onClick={() => onSelect(layer.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 8px",
        borderRadius: 6,
        background: isActive ? "rgba(77,124,254,0.12)" : "transparent",
        cursor: "pointer",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility(layer.id);
        }}
        title={layer.visible ? "Hide layer" : "Show layer"}
        style={{ border: "none", background: "none", cursor: "pointer", opacity: layer.visible ? 1 : 0.4 }}
      >
        {layer.visible ? "👁" : "🚫"}
      </button>

      {editing ? (
        <input
          autoFocus
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") {
              setDraftName(layer.name);
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          style={{ flex: 1, fontSize: 13, padding: "2px 4px" }}
        />
      ) : (
        <span
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          style={{ flex: 1, fontSize: 13, opacity: layer.visible ? 1 : 0.5 }}
        >
          {layer.name}
        </span>
      )}

      <span style={{ fontSize: 11, color: "#8a8f98" }}>{objectCount}</span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleLock(layer.id);
        }}
        title={layer.locked ? "Unlock layer" : "Lock layer"}
        style={{ border: "none", background: "none", cursor: "pointer", opacity: layer.locked ? 1 : 0.4 }}
      >
        {layer.locked ? "🔒" : "🔓"}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(layer.id);
        }}
        title="Delete layer"
        style={{ border: "none", background: "none", cursor: "pointer", opacity: 0.5 }}
      >
        🗑
      </button>
    </div>
  );
};

export default LayerItem;
