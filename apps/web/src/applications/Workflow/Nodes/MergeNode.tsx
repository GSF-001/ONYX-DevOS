/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// MergeNode.tsx — joins multiple incoming branches back into a single path

import React from "react";
import { NodeShell } from "./NodeShell";
import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";
import { useWorkflowActions } from "../WorkflowHooks";

interface Props {
  node: AnyWorkflowNode<"merge">;
  selected: boolean;
  onStartConnection: (nodeId: string, p: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
}

export function MergeNode({ node, selected, onStartConnection, onFinishConnection }: Props) {
  const { updateNodeConfig } = useWorkflowActions();
  return (
    <NodeShell node={node} selected={selected} onStartConnection={onStartConnection} onFinishConnection={onFinishConnection}>
      <select
        className="wf-select"
        value={node.config.strategy}
        onChange={(e) => updateNodeConfig(node.id, { strategy: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <option value="all">Wait for all</option>
        <option value="any">Wait for any</option>
      </select>
    </NodeShell>
  );
}
