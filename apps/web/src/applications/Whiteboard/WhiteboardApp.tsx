/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// WhiteboardApp.tsx

import React, { useCallback, useMemo, useState } from "react";
import { WhiteboardStore } from "./WhiteboardStore";
import { ToolMode, WhiteboardObject } from "./WhiteboardTypes";
import {
  useObjects,
  useSelection,
  useCamera,
  useLayers,
  useTool,
  useWhiteboardAPI,
  useUndoRedo,
  useKeyboardShortcuts,
  useActiveLayer,
} from "./WhiteboardHooks";
import { InfiniteCanvas } from "./Canvas/InfiniteCanvas";
import { Zoom } from "./Canvas/Zoom";
import { HorizontalRuler } from "./Rulers/HorizontalRuler";
import { VerticalRuler } from "./Rulers/VerticalRuler";
import { LayerPanel } from "./Layers/LayerPanel";
import { TemplateGallery } from "./Templates/TemplateGallery";
import { getBuiltInTemplates, instantiateTemplate } from "./Templates/TemplateLoader";
import { ColorSwatch } from "./Widgets/ColorSwatch";
import "./WhiteboardStyles.css";

interface WhiteboardAppProps {
  store?: WhiteboardStore;
}

const TOOL_ITEMS: { tool: ToolMode; icon: string; label: string }[] = [
  { tool: "select", icon: "↖", label: "Select" },
  { tool: "pan", icon: "✋", label: "Pan" },
  { tool: "sticky", icon: "🗒", label: "Sticky note" },
  { tool: "rectangle", icon: "▭", label: "Rectangle" },
  { tool: "ellipse", icon: "◯", label: "Ellipse" },
  { tool: "arrow", icon: "↗", label: "Arrow" },
  { tool: "text", icon: "T", label: "Text" },
  { tool: "frame", icon: "▦", label: "Frame" },
];

export const WhiteboardApp: React.FC<WhiteboardAppProps> = ({ store: storeProp }) => {
  const store = useMemo(() => storeProp ?? new WhiteboardStore(), [storeProp]);
  const api = useWhiteboardAPI(store);
  const objects = useObjects(store);
  const selection = useSelection(store);
  const [camera, setCamera] = useCamera(store);
  const { layers, layerOrder } = useLayers(store);
  const [tool, setTool] = useTool(store);
  const { manager: history, undo, redo } = useUndoRedo(store);
  const [activeLayerId, setActiveLayerId] = useActiveLayer(store);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const templates = useMemo(() => getBuiltInTemplates(), []);

  const selectedObjects = useMemo(
    () => objects.filter((o) => selection.selectedIds.includes(o.id)),
    [objects, selection.selectedIds]
  );

  const handleCanvasClickCreate = useCallback(
    (worldX: number, worldY: number) => {
      switch (tool) {
        case "sticky":
          api.createStickyNote(worldX, worldY);
          break;
        case "rectangle":
          api.createRectangle(worldX, worldY);
          break;
        case "ellipse":
          api.createEllipse(worldX, worldY);
          break;
        case "text":
          api.createText(worldX, worldY);
          break;
        case "frame":
          api.createFrame(worldX, worldY);
          break;
        default:
          return;
      }
      store.setTool("select");
    },
    [api, store, tool]
  );

  const handleUpdateObject = useCallback(
    (id: string, patch: Partial<WhiteboardObject>) => {
      store.updateObject(id, patch);
    },
    [store]
  );

  const handleCommit = useCallback(() => {
    // In a full implementation this would push a diff-based command onto
    // the UndoRedoManager. Kept intentionally simple here since drag
    // updates are already applied optimistically to the store.
  }, []);

  const handleDelete = useCallback(() => {
    if (selection.selectedIds.length === 0) return;
    const removed = objects.filter((o) => selection.selectedIds.includes(o.id));
    history.recordRemoveObjects(removed);
    store.clearSelection();
  }, [history, objects, selection.selectedIds, store]);

  const handleDuplicate = useCallback(() => {
    if (selection.selectedIds.length === 0) return;
    const clones = api.duplicateObjects(selection.selectedIds);
    store.selectObjects(clones.map((c) => c.id));
  }, [api, selection.selectedIds, store]);

  const handleSelectAll = useCallback(() => {
    store.selectObjects(objects.map((o) => o.id));
  }, [objects, store]);

  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    onDelete: handleDelete,
    onDuplicate: handleDuplicate,
    onSelectAll: handleSelectAll,
    onEscape: () => store.clearSelection(),
  });

  const handleUseTemplate = useCallback(
    (template: (typeof templates)[number]) => {
      const { objects: newObjects, layers: newLayers } = instantiateTemplate(template);
      newLayers.forEach((layer) => {
        store.updateLayer(layer.id, layer);
      });
      newObjects.forEach((obj) => store.addObject(obj));
      setShowTemplates(false);
    },
    [store]
  );

  const singleSelected = selectedObjects.length === 1 ? selectedObjects[0] : null;

  return (
    <div className="wb-app" style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <div className="wb-toolbar" style={{ display: "flex", alignItems: "center", gap: 4, padding: 8, borderBottom: "1px solid #e6e8ec", background: "#ffffff" }}>
        {TOOL_ITEMS.map((item) => (
          <button
            key={item.tool}
            title={item.label}
            onClick={() => setTool(item.tool)}
            style={{
              width: 32,
              height: 32,
              border: "none",
              borderRadius: 6,
              background: tool === item.tool ? "rgba(77,124,254,0.14)" : "transparent",
              color: tool === item.tool ? "#4d7cfe" : "#3a3f4a",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            {item.icon}
          </button>
        ))}

        <div style={{ width: 1, height: 20, background: "#e6e8ec", margin: "0 6px" }} />

        <button onClick={undo} title="Undo" style={toolbarBtnStyle}>↺</button>
        <button onClick={redo} title="Redo" style={toolbarBtnStyle}>↻</button>

        <div style={{ width: 1, height: 20, background: "#e6e8ec", margin: "0 6px" }} />

        <button onClick={() => setShowTemplates(true)} style={{ ...toolbarBtnStyle, width: "auto", padding: "0 10px", fontSize: 12 }}>
          Templates
        </button>

        {singleSelected && singleSelected.type === "sticky" && (
          <div style={{ marginLeft: 12 }}>
            <ColorSwatch
              value={(singleSelected as any).color}
              onChange={(color) => handleUpdateObject(singleSelected.id, { color } as any)}
            />
          </div>
        )}

        <div style={{ flex: 1 }} />

        <button onClick={() => setShowLayerPanel((v) => !v)} style={{ ...toolbarBtnStyle, width: "auto", padding: "0 10px", fontSize: 12 }}>
          {showLayerPanel ? "Hide layers" : "Show layers"}
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {store.getState().rulersEnabled && (
            <div style={{ display: "flex" }}>
              <div style={{ width: 20, height: 20, background: "#ffffff", borderRight: "1px solid #e6e8ec", borderBottom: "1px solid #e6e8ec" }} />
              <HorizontalRuler camera={camera} width={2000} />
            </div>
          )}
          <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
            {store.getState().rulersEnabled && <VerticalRuler camera={camera} height={2000} />}
            <div
              style={{ flex: 1, position: "relative" }}
              onDoubleClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const worldX = (e.clientX - rect.left - camera.x) / camera.zoom;
                const worldY = (e.clientY - rect.top - camera.y) / camera.zoom;
                handleCanvasClickCreate(worldX, worldY);
              }}
            >
              <InfiniteCanvas
                objects={objects}
                camera={camera}
                setCamera={setCamera}
                selectedIds={selection.selectedIds}
                onSelect={selection.select}
                onUpdateObject={handleUpdateObject}
                onCommit={handleCommit}
                gridEnabled={store.getState().gridEnabled}
                gridSize={store.getState().gridSize}
              />
              <Zoom
                zoom={camera.zoom}
                onZoomIn={() => store.zoomTo(camera.zoom * 1.2)}
                onZoomOut={() => store.zoomTo(camera.zoom / 1.2)}
                onReset={() => store.zoomTo(1)}
                onFitToScreen={() => store.setCamera({ x: 0, y: 0, zoom: 1 })}
              />
            </div>
          </div>
        </div>

        {showLayerPanel && (
          <LayerPanel
            layers={layers}
            layerOrder={layerOrder}
            objects={objects}
            activeLayerId={activeLayerId}
            onSelectLayer={setActiveLayerId}
            onToggleVisibility={(id) => store.updateLayer(id, { visible: !layers[id].visible })}
            onToggleLock={(id) => store.updateLayer(id, { locked: !layers[id].locked })}
            onRenameLayer={(id, name) => store.updateLayer(id, { name })}
            onDeleteLayer={(id) => store.removeLayer(id)}
            onAddLayer={() => store.addLayer()}
          />
        )}
      </div>

      {showTemplates && (
        <TemplateGallery templates={templates} onUse={handleUseTemplate} onClose={() => setShowTemplates(false)} />
      )}
    </div>
  );
};

const toolbarBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  border: "none",
  borderRadius: 6,
  background: "transparent",
  cursor: "pointer",
  fontSize: 15,
  color: "#3a3f4a",
};

export default WhiteboardApp;
