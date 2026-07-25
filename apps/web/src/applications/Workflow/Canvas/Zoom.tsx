/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Zoom.tsx — on-canvas zoom control cluster

import React from "react";
import { MAX_ZOOM, MIN_ZOOM } from "./Camera";
import { useCamera, useWorkflowActions } from "../WorkflowHooks";

export function ZoomControls() {
  const camera = useCamera();
  const { setCamera } = useWorkflowActions();

  const step = (delta: number) => {
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, camera.zoom + delta));
    setCamera({ zoom: nextZoom });
  };

  return (
    <div className="wf-zoom-controls">
      <button className="wf-btn-bevel" onClick={() => step(-0.1)} title="Zoom out">
        −
      </button>
      <span className="wf-zoom-readout">{Math.round(camera.zoom * 100)}%</span>
      <button className="wf-btn-bevel" onClick={() => step(0.1)} title="Zoom in">
        +
      </button>
      <button className="wf-btn-bevel" onClick={() => setCamera({ x: 0, y: 0, zoom: 1 })} title="Reset view">
        ⤢
      </button>
    </div>
  );
}
