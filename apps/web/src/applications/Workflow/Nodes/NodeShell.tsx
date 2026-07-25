/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// NodeShell.tsx — shared chrome (drag, ports, selection ring) wrapping every node kind

import React, { useCallback, useRef } from "react";
import { AnyWorkflowNode, NODE_COLORS, Vec2 } from "../WorkflowTypes";
import { useCamera, useExecutionStatus, useWorkflowActions } from "../WorkflowHooks";
import { screenToWorld } from "../Canvas/Camera";

interface NodeShellProps {
  node: AnyWorkflowNode;
  selected: boolean;
  onStartConnection: (nodeId: string, screenPoint: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
  children: React.ReactNode;
}

export function NodeShell({ node, selected, onStartConnection, onFinishConnection, children }: NodeShellProps) {
  const camera = useCamera();
  const { updateNode, bringToFront, toggleNodeSelection, selectNodes, toggleBreakpoint } = useWorkflowActions();
  const { activeNodeId } = useExecutionStatus();
  const dragging = useRef(false);
  const dragStart = useRef<Vec2>({ x: 0, y: 0 });
  const nodeStart = useRef<Vec2>({ x: 0, y: 0 });

  const color = NODE_COLORS[node.kind];
  const isActive = activeNodeId === node.id;

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (node.locked) return;
      e.stopPropagation();
      bringToFront(node.id);
      if (e.shiftKey) {
        toggleNodeSelection(node.id);
      } else if (!selected) {
        selectNodes([node.id]);
      }
      dragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      nodeStart.current = { ...node.position };
      (e.target as Element).setPointerCapture(e.pointerId);
    },
    [node, selected, bringToFront, toggleNodeSelection, selectNodes]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const dx = (e.clientX - dragStart.current.x) / camera.zoom;
      const dy = (e.clientY - dragStart.current.y) / camera.zoom;
      updateNode(node.id, { position: { x: nodeStart.current.x + dx, y: nodeStart.current.y + dy } });
    },
    [camera.zoom, node.id, updateNode]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as Element).releasePointerCapture(e.pointerId);
  }, []);

  const onPortOutDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      const rect = (e.target as Element).getBoundingClientRect();
      onStartConnection(node.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    },
    [node.id, onStartConnection]
  );

  const onPortInUp = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      onFinishConnection(node.id);
    },
    [node.id, onFinishConnection]
  );

  return (
    <div
      className={`wf-node ${selected ? "wf-node-selected" : ""} ${isActive ? "wf-node-active" : ""}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.size.x,
        minHeight: node.size.y,
        zIndex: node.zIndex,
        borderColor: selected ? "#fff" : color,
        display: node.hidden ? "none" : "flex",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={() => toggleBreakpoint(node.id)}
    >
      {node.kind !== "start" && (
        <div className="wf-port wf-port-in" onPointerUp={onPortInUp} title="Input" />
      )}
      <div className="wf-node-header" style={{ background: color }}>
        <span className="wf-node-title">{node.title}</span>
        {node.locked && <span className="wf-node-lock">🔒</span>}
      </div>
      <div className="wf-node-body">{children}</div>
      {node.kind !== "end" && (
        <div className="wf-port wf-port-out" onPointerDown={onPortOutDown} title="Output" />
      )}
    </div>
  );
}
