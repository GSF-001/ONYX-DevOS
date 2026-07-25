/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Canvas/Camera.tsx

import { useCallback } from "react";
import { Camera, Point } from "../WhiteboardTypes";

export function screenToWorld(point: Point, camera: Camera): Point {
  return {
    x: (point.x - camera.x) / camera.zoom,
    y: (point.y - camera.y) / camera.zoom,
  };
}

export function worldToScreen(point: Point, camera: Camera): Point {
  return {
    x: point.x * camera.zoom + camera.x,
    y: point.y * camera.zoom + camera.y,
  };
}

export function getCameraTransform(camera: Camera): string {
  return `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`;
}

interface UseCameraControlsArgs {
  camera: Camera;
  setCamera: (camera: Partial<Camera>) => void;
}

export function useCameraControls({ camera, setCamera }: UseCameraControlsArgs) {
  const pan = useCallback(
    (dx: number, dy: number) => {
      setCamera({ x: camera.x + dx, y: camera.y + dy });
    },
    [camera, setCamera]
  );

  const zoomAt = useCallback(
    (zoomDelta: number, anchor: Point) => {
      const nextZoom = Math.min(8, Math.max(0.05, camera.zoom * (1 + zoomDelta)));
      const worldX = (anchor.x - camera.x) / camera.zoom;
      const worldY = (anchor.y - camera.y) / camera.zoom;
      setCamera({
        zoom: nextZoom,
        x: anchor.x - worldX * nextZoom,
        y: anchor.y - worldY * nextZoom,
      });
    },
    [camera, setCamera]
  );

  const resetCamera = useCallback(() => {
    setCamera({ x: 0, y: 0, zoom: 1 });
  }, [setCamera]);

  const centerOn = useCallback(
    (worldPoint: Point, viewportSize: { width: number; height: number }) => {
      setCamera({
        x: viewportSize.width / 2 - worldPoint.x * camera.zoom,
        y: viewportSize.height / 2 - worldPoint.y * camera.zoom,
      });
    },
    [camera.zoom, setCamera]
  );

  return { pan, zoomAt, resetCamera, centerOn };
}
