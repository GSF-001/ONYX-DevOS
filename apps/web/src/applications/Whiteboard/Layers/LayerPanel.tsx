// Layers/LayerPanel.tsx

import React, { useMemo, useState } from "react";
import { Layer, WhiteboardObject } from "../WhiteboardTypes";
import { LayerItem } from "./LayerItem";
import { sortLayersByOrder } from "./LayerOrder";

interface LayerPanelProps {
  layers: Record<string, Layer>;
  layerOrder: string[];
  objects: WhiteboardObject[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onRenameLayer: (id: string, name: string) => void;
  onDeleteLayer: (id: string) => void;
  onAddLayer: () => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  layerOrder,
  objects,
  activeLayerId,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onRenameLayer,
  onDeleteLayer,
  onAddLayer,
}) => {
  const [search, setSearch] = useState("");

  const orderedLayers = useMemo(() => {
    const all = layerOrder.map((id) => layers[id]).filter(Boolean) as Layer[];
    const sorted = sortLayersByOrder(all);
    if (!search.trim()) return sorted;
    return sorted.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));
  }, [layers, layerOrder, search]);

  const countByLayer = useMemo(() => {
    const map: Record<string, number> = {};
    objects.forEach((o) => {
      map[o.layerId] = (map[o.layerId] ?? 0) + 1;
    });
    return map;
  }, [objects]);

  return (
    <div
      className="wb-layer-panel"
      style={{
        width: 240,
        background: "#ffffff",
        borderLeft: "1px solid #e6e8ec",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ padding: 10, display: "flex", gap: 6, alignItems: "center" }}>
        <input
          placeholder="Search layers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            fontSize: 12,
            padding: "6px 8px",
            border: "1px solid #e6e8ec",
            borderRadius: 6,
          }}
        />
        <button
          onClick={onAddLayer}
          title="Add layer"
          style={{
            border: "1px solid #e6e8ec",
            background: "#f7f8fa",
            borderRadius: 6,
            width: 28,
            height: 28,
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 6px 10px" }}>
        {orderedLayers.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            isActive={layer.id === activeLayerId}
            objectCount={countByLayer[layer.id] ?? 0}
            onSelect={onSelectLayer}
            onToggleVisibility={onToggleVisibility}
            onToggleLock={onToggleLock}
            onRename={onRenameLayer}
            onDelete={onDeleteLayer}
          />
        ))}
        {orderedLayers.length === 0 && (
          <div style={{ fontSize: 12, color: "#9aa0ac", padding: 12, textAlign: "center" }}>
            No layers found
          </div>
        )}
      </div>
    </div>
  );
};

export default LayerPanel;
