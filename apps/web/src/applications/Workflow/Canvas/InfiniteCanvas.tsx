/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Canvas/InfiniteCanvas.tsx — main workflow graph surface: pan/zoom, nodes, edges, connection dragging, marquee select

import React, { useCallback, useRef, useState } from "react";
import { useCameraController } from "./Camera";
import { Grid } from "./Grid";
import { useSelectionBox, SelectionOverlay } from "./Selection";
import { useNodes, useEdges, useWorkflowState, useWorkflowActions } from "../WorkflowHooks";
import { NODE_COMPONENTS } from "../Nodes";
import { NodeShell } from "../Nodes/NodeShell";
import { Edge } from "../Connections/Edge";
import { Vec2 } from "../WorkflowTypes";

export function InfiniteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useNodes();
  const edges = useEdges();
  const state = useWorkflowState();
  const { addEdge, clearSelection, selectNodes } = useWorkflowActions();
  const { camera, startPan, movePan, endPan, onWheel } = useCameraController(containerRef);

  const [connecting, setConnecting] = useState<{ sourceId: string; point: Vec2 } | null>(null);
  const [cursor, setCursor] = useState<Vec2>({ x: 0, y: 0 });

  const { rect: selectionRect, beginSelection, updateSelection, endSelection } = useSelectionBox({
    camera,
    nodes,
    onSelect: selectNodes,
  });

  const getLocalPoint = useCallback((e: React.PointerEvent): Vec2 => {
    const r = containerRef.current?.getBoundingClientRect();
    return { x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0) };
  }, []);

  const onBackgroundPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 1 || e.altKey) {
        startPan(e);
        return;
      }
      clearSelection();
      beginSelection(getLocalPoint(e));
    },
    [beginSelection, clearSelection, getLocalPoint, startPan]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      movePan(e);
      const p = getLocalPoint(e);
      setCursor(p);
      updateSelection(p);
    },
    [getLocalPoint, movePan, updateSelection]
  );

  const onPointerUp = useCallback(() => {
    endPan();
    endSelection();
    if (connecting) setConnecting(null);
  }, [connecting, endPan, endSelection]);

  const handleStartConnection = useCallback((nodeId: string, screenPoint: Vec2) => {
    const r = containerRef.current?.getBoundingClientRect();
    setConnecting({
      sourceId: nodeId,
      point: { x: screenPoint.x - (r?.left ?? 0), y: screenPoint.y - (r?.top ?? 0) },
    });
  }, []);

  const handleFinishConnection = useCallback(
    (targetId: string) => {
      if (connecting && connecting.sourceId !== targetId) {
        addEdge(connecting.sourceId, targetId);
      }
      setConnecting(null);
    },
    [addEdge, connecting]
  );

  const nodeById = useCallback((id: string) => nodes.find((n) => n.id === id), [nodes]);

  return (
    <div
      ref={containerRef}
      className="wf-infinite-canvas"
      onWheel={onWheel}
      onPointerDown={onBackgroundPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", touchAction: "none" }}
    >
      <Grid camera={camera} />

      <svg
        className="wf-edges-layer"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <defs>
          <marker id="wf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
          </marker>
        </defs>
        <g transform={`translate(${camera.x}, ${camera.y}) scale(${camera.zoom})`} style={{ pointerEvents: "auto" }}>
          {edges.map((edge) => {
            const source = nodeById(edge.sourceNodeId);
            const target = nodeById(edge.targetNodeId);
            if (!source || !target) return null;
            return <Edge key={edge.id} edge={edge} source={source} target={target} allNodes={nodes} />;
          })}
        </g>
        {connecting && (
          <line
            x1={connecting.point.x}
            y1={connecting.point.y}
            x2={cursor.x}
            y2={cursor.y}
            stroke="#ffcc00"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
        )}
      </svg>

      <div
        className="wf-nodes-layer"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {nodes
          .filter((n) => !n.hidden)
          .map((node) => {
            const NodeComponent = NODE_COMPONENTS[node.kind];
            return (
              <NodeShell
                key={node.id}
                node={node}
                selected={state.selectedNodeIds.includes(node.id)}
                onStartConnection={handleStartConnection}
                onFinishConnection={handleFinishConnection}
              >
                <NodeComponent node={node} />
              </NodeShell>
            );
          })}
      </div>

      <SelectionOverlay rect={selectionRect} />
    </div>
  );
}

export default InfiniteCanvas;
