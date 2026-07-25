/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// DelayNode.tsx — pauses execution for a configured duration before continuing

import React from "react";
import { NodeShell } from "./NodeShell";
import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";
import { useWorkflowActions } from "../WorkflowHooks";

interface Props {
  node: AnyWorkflowNode<"delay">;
  selected: boolean;
  onStartConnection: (nodeId: string, p: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
}

export function DelayNode({ node, selected, onStartConnection, onFinishConnection }: Props) {
  const { updateNodeConfig } = useWorkflowActions();
  return (
    <NodeShell node={node} selected={selected} onStartConnection={onStartConnection} onFinishConnection={onFinishConnection}>
      <input
        type="number"
        className="wf-input"
        value={node.config.durationMs}
        onChange={(e) => updateNodeConfig(node.id, { durationMs: Number(e.target.value) })}
        onPointerDown={(e) => e.stopPropagation()}
      />
      <div className="wf-node-row wf-node-row-small">ms wait</div>
    </NodeShell>
  );
}
