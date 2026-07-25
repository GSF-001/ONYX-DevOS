/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Edge.tsx — a single connection between two nodes

import React, { useCallback } from "react";
import { AnyWorkflowNode, WorkflowEdge } from "../WorkflowTypes";
import { computeRoute } from "./SmartRouting";
import { EdgeLabel } from "./EdgeLabel";
import { useEdgeDashOffset } from "./EdgeAnimation";
import { useWorkflowActions, useWorkflowState } from "../WorkflowHooks";

interface Props {
  edge: WorkflowEdge;
  source: AnyWorkflowNode;
  target: AnyWorkflowNode;
  allNodes: AnyWorkflowNode[];
}

export function Edge({ edge, source, target, allNodes }: Props) {
  const { selectEdge, removeEdge } = useWorkflowActions();
  const state = useWorkflowState();
  const selected = state.selectedEdgeId === edge.id;
  const route = computeRoute(source, target, allNodes);
  const dashOffset = useEdgeDashOffset(edge.animated);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectEdge(edge.id);
    },
    [edge.id, selectEdge]
  );

  const onKeyDelete = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") removeEdge(edge.id);
    },
    [edge.id, removeEdge]
  );

  const tone = edge.condition === "true" ? "true" : edge.condition === "false" ? "false" : "default";

  return (
    <g
      className="wf-edge"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDelete}
      style={{ color: selected ? "#ffcc00" : "#666" }}
    >
      <path d={route.d} fill="none" stroke="transparent" strokeWidth={14} />
      <path
        d={route.d}
        fill="none"
        stroke="currentColor"
        strokeWidth={selected ? 2.5 : 1.75}
        markerEnd="url(#wf-arrow)"
        strokeDasharray={edge.animated ? "6 4" : undefined}
        strokeDashoffset={edge.animated ? dashOffset : undefined}
      />
      {edge.label && <EdgeLabel point={route.midpoint} text={edge.label} tone={tone} />}
      {edge.condition && !edge.label && <EdgeLabel point={route.midpoint} text={edge.condition} tone={tone} />}
    </g>
  );
}
