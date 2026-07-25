// Canvas/InfiniteCanvas.tsx

import React, { useCallback, useRef, useState } from "react";
import { Camera, Point, WhiteboardObject } from "../WhiteboardTypes";
import { screenToWorld, getCameraTransform, useCameraControls } from "./Camera";
import { Grid } from "./Grid";
import { Background } from "./Background";
import { StickyNote } from "../Objects/StickyNote";
import { Rectangle } from "../Objects/Rectangle";
import { Ellipse } from "../Objects/Ellipse";
import { Arrow } from "../Objects/Arrow";
import { Text } from "../Objects/Text";
import { Frame } from "../Objects/Frame";
import { Image } from "../Objects/Image";
import { Icon } from "../Objects/Icon";
import { Video } from "../Objects/Video";
import { SelectionBox, MarqueeBox } from "../Selection/SelectionBox";
import { SelectionHandles } from "../Selection/SelectionHandles";
import { rectFromPoints, isMarqueeMeaningful } from "../Selection/Marquee";
import { hitTestTopmost, hitTestAll } from "../Selection/HitTest";
import { resolveSelectionClick } from "../Selection/MultiSelect";
import { findObjectsWithinRect } from "../Collisions/CollisionDetection";
import { unionBounds } from "../Collisions/BoundingBox";

interface InfiniteCanvasProps {
  objects: WhiteboardObject[];
  camera: Camera;
  setCamera: (camera: Partial<Camera>) => void;
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  onUpdateObject: (id: string, patch: Partial<WhiteboardObject>) => void;
  onCommit: () => void;
  gridEnabled: boolean;
  gridSize: number;
}

function renderObjectContent(
  obj: WhiteboardObject,
  selected: boolean,
  onChange: (patch: Partial<WhiteboardObject>) => void,
  onCommit: () => void
) {
  switch (obj.type) {
    case "sticky":
      return <StickyNote object={obj} selected={selected} onChange={onChange} onCommit={onCommit} />;
    case "rectangle":
      return <Rectangle object={obj} selected={selected} />;
    case "ellipse":
      return <Ellipse object={obj} selected={selected} />;
    case "arrow":
      return <Arrow object={obj} selected={selected} />;
    case "text":
      return <Text object={obj} selected={selected} onChange={onChange} onCommit={onCommit} />;
    case "frame":
      return <Frame object={obj} selected={selected} onRename={(name) => onChange({ name })} />;
    case "image":
      return <Image object={obj} selected={selected} />;
    case "icon":
      return <Icon object={obj} selected={selected} />;
    case "video":
      return <Video object={obj} selected={selected} />;
    default:
      return null;
  }
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  objects,
  camera,
  setCamera,
  selectedIds,
  onSelect,
  onUpdateObject,
  onCommit,
  gridEnabled,
  gridSize,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [marqueeStart, setMarqueeStart] = useState<Point | null>(null);
  const [marqueeRect, setMarqueeRect] = useState<{ x: number; y: number; width: number; height: number } | null>(
    null
  );
  const [isPanning, setIsPanning] = useState(false);
  const [dragState, setDragState] = useState<{ ids: string[]; start: Point; origins: Record<string, Point> } | null>(
    null
  );
  const lastClickedRef = useRef<string | null>(null);

  const { zoomAt } = useCameraControls({ camera, setCamera });

  const getViewportSize = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    return { width: rect?.width ?? 0, height: rect?.height ?? 0 };
  };

  const getScreenPoint = useCallback((e: React.PointerEvent): Point => {
    const rect = containerRef.current?.getBoundingClientRect();
    return { x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) };
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const screenPoint = getScreenPoint(e as unknown as React.PointerEvent);
      if (e.ctrlKey || e.metaKey) {
        zoomAt(-e.deltaY * 0.01, screenPoint);
      } else {
        setCamera({ x: camera.x - e.deltaX, y: camera.y - e.deltaY });
      }
    },
    [camera, getScreenPoint, setCamera, zoomAt]
  );

  const handleBackgroundPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 1 || e.altKey) {
        setIsPanning(true);
        return;
      }
      const screenPoint = getScreenPoint(e);
      setMarqueeStart(screenPoint);
      setMarqueeRect({ x: screenPoint.x, y: screenPoint.y, width: 0, height: 0 });
      if (!e.shiftKey) onSelect([]);
    },
    [getScreenPoint, onSelect]
  );

  const handleObjectPointerDown = useCallback(
    (e: React.PointerEvent, obj: WhiteboardObject) => {
      e.stopPropagation();
      if (obj.locked) return;

      const modifiers = { shiftKey: e.shiftKey, metaKey: e.metaKey, ctrlKey: e.ctrlKey };
      const orderedIds = objects.map((o) => o.id);
      const nextSelection = resolveSelectionClick(
        selectedIds,
        obj.id,
        modifiers,
        orderedIds,
        lastClickedRef.current
      );
      lastClickedRef.current = obj.id;
      onSelect(nextSelection);

      const worldPoint = screenToWorld(getScreenPoint(e), camera);
      const origins: Record<string, Point> = {};
      nextSelection.forEach((id) => {
        const o = objects.find((x) => x.id === id);
        if (o) origins[id] = { x: o.x, y: o.y };
      });
      setDragState({ ids: nextSelection, start: worldPoint, origins });
    },
    [camera, getScreenPoint, objects, onSelect, selectedIds]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isPanning) {
        setCamera({ x: camera.x + e.movementX, y: camera.y + e.movementY });
        return;
      }

      if (marqueeStart) {
        const current = getScreenPoint(e);
        const rect = rectFromPoints(marqueeStart, current);
        setMarqueeRect(rect);
        return;
      }

      if (dragState) {
        const worldPoint = screenToWorld(getScreenPoint(e), camera);
        const dx = worldPoint.x - dragState.start.x;
        const dy = worldPoint.y - dragState.start.y;
        dragState.ids.forEach((id) => {
          const origin = dragState.origins[id];
          if (origin) onUpdateObject(id, { x: origin.x + dx, y: origin.y + dy });
        });
      }
    },
    [camera, dragState, getScreenPoint, isPanning, marqueeStart, onUpdateObject, setCamera]
  );

  const handlePointerUp = useCallback(() => {
    if (marqueeRect && isMarqueeMeaningful(marqueeRect)) {
      const worldRect = {
        x: (marqueeRect.x - camera.x) / camera.zoom,
        y: (marqueeRect.y - camera.y) / camera.zoom,
        width: marqueeRect.width / camera.zoom,
        height: marqueeRect.height / camera.zoom,
      };
      const hits = findObjectsWithinRect(worldRect, objects, 0.15);
      onSelect(hits.map((h) => h.id));
    }
    setMarqueeStart(null);
    setMarqueeRect(null);
    setIsPanning(false);
    if (dragState) {
      onCommit();
      setDragState(null);
    }
  }, [camera, dragState, marqueeRect, objects, onCommit, onSelect]);

  const selectionBounds = unionBounds(
    objects.filter((o) => selectedIds.includes(o.id)).map((o) => ({ x: o.x, y: o.y, width: o.width, height: o.height }))
  );

  return (
    <div
      ref={containerRef}
      className="wb-infinite-canvas"
      onWheel={handleWheel}
      onPointerDown={handleBackgroundPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: isPanning ? "grabbing" : "default",
        touchAction: "none",
      }}
    >
      <Background />
      <Grid
        camera={camera}
        gridSize={gridSize}
        viewportWidth={getViewportSize().width}
        viewportHeight={getViewportSize().height}
        enabled={gridEnabled}
      />

      <div
        className="wb-canvas-world"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: getCameraTransform(camera),
          transformOrigin: "0 0",
        }}
      >
        {objects
          .filter((o) => o.visible)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((obj) => (
            <div
              key={obj.id}
              onPointerDown={(e) => handleObjectPointerDown(e, obj)}
              style={{
                position: "absolute",
                left: obj.x,
                top: obj.y,
                width: obj.width,
                height: obj.height,
                transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
                opacity: obj.opacity,
                cursor: obj.locked ? "not-allowed" : "move",
              }}
            >
              {renderObjectContent(obj, selectedIds.includes(obj.id), (patch) => onUpdateObject(obj.id, patch), onCommit)}
            </div>
          ))}
      </div>

      {selectionBounds && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${camera.x}px, ${camera.y}px)`,
            pointerEvents: "none",
          }}
        >
          <SelectionBox bounds={selectionBounds} zoom={camera.zoom} />
          {selectedIds.length === 1 && (
            <div style={{ pointerEvents: "auto" }}>
              <SelectionHandles bounds={selectionBounds} zoom={camera.zoom} onHandleDragStart={() => {}} />
            </div>
          )}
        </div>
      )}

      {marqueeRect && isMarqueeMeaningful(marqueeRect) && <MarqueeBox rect={marqueeRect} />}
    </div>
  );
};

export default InfiniteCanvas;
