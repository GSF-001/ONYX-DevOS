/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// NodePreviewCard.tsx — hover tooltip summarizing a node's config, used by Search/Layers/Minimap-style UI

import React from "react";
import { AnyWorkflowNode, NODE_COLORS } from "../WorkflowTypes";

interface Props {
  node: AnyWorkflowNode;
  anchor: { x: number; y: number };
}

function summarize(node: AnyWorkflowNode): string {
  switch (node.kind) {
    case "task":
      return `Runs "${(node.config as any).action}" (timeout ${(node.config as any).timeoutMs}ms)`;
    case "branch":
      return `Splits when ${(node.config as any).condition}`;
    case "decision":
      return `Evaluates ${(node.config as any).expression}`;
    case "delay":
      return `Waits ${(node.config as any).durationMs}ms`;
    case "loop":
      return `Loops while ${(node.config as any).condition}`;
    case "variable":
      return `${(node.config as any).operation} ${(node.config as any).name} = ${(node.config as any).value}`;
    case "merge":
      return `Waits for ${(node.config as any).strategy} branches`;
    case "end":
      return `Terminates as ${(node.config as any).status}`;
    default:
      return "Entry point";
  }
}

export function NodePreviewCard({ node, anchor }: Props) {
  return (
    <div className="wf-preview-card" style={{ left: anchor.x + 12, top: anchor.y + 12, borderColor: NODE_COLORS[node.kind] }}>
      <div className="wf-preview-title">{node.title}</div>
      <div className="wf-preview-body">{summarize(node)}</div>
    </div>
  );
}
