/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Camera.tsx — pan/zoom transform state + coordinate conversion helpers

import { useCallback, useRef } from "react";
import { useCamera, useWorkflowActions } from "../WorkflowHooks";
import { Vec2 } from "../WorkflowTypes";

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 2.5;

export function screenToWorld(screen: Vec2, camera: { x: number; y: number; zoom: number }): Vec2 {
  return {
    x: (screen.x - camera.x) / camera.zoom,
    y: (screen.y - camera.y) / camera.zoom,
  };
}

export function worldToScreen(world: Vec2, camera: { x: number; y: number; zoom: number }): Vec2 {
  return {
    x: world.x * camera.zoom + camera.x,
    y: world.y * camera.zoom + camera.y,
  };
}

export function useCameraController(containerRef: React.RefObject<HTMLDivElement>) {
  const camera = useCamera();
  const { setCamera } = useWorkflowActions();
  const panning = useRef(false);
  const lastPoint = useRef<Vec2>({ x: 0, y: 0 });

  const startPan = useCallback((e: React.PointerEvent) => {
    panning.current = true;
    lastPoint.current = { x: e.clientX, y: e.clientY };
  }, []);

  const movePan = useCallback(
    (e: React.PointerEvent) => {
      if (!panning.current) return;
      const dx = e.clientX - lastPoint.current.x;
      const dy = e.clientY - lastPoint.current.y;
      lastPoint.current = { x: e.clientX, y: e.clientY };
      setCamera({ x: camera.x + dx, y: camera.y + dy });
    },
    [camera.x, camera.y, setCamera]
  );

  const endPan = useCallback(() => {
    panning.current = false;
  }, []);

  const zoomAt = useCallback(
    (screenPoint: Vec2, deltaZoom: number) => {
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, camera.zoom * (1 + deltaZoom)));
      const worldBefore = screenToWorld(screenPoint, camera);
      const worldAfter = screenToWorld(screenPoint, { ...camera, zoom: nextZoom });
      setCamera({
        zoom: nextZoom,
        x: camera.x + (worldAfter.x - worldBefore.x) * nextZoom,
        y: camera.y + (worldAfter.y - worldBefore.y) * nextZoom,
      });
    },
    [camera, setCamera]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      const point = rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : { x: 0, y: 0 };
      zoomAt(point, -e.deltaY * 0.001);
    },
    [zoomAt, containerRef]
  );

  const resetCamera = useCallback(() => setCamera({ x: 0, y: 0, zoom: 1 }), [setCamera]);

  return { camera, startPan, movePan, endPan, onWheel, zoomAt, resetCamera };
}
