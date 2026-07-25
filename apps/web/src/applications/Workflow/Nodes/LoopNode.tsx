/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// LoopNode.tsx — repeats its outgoing branch while a condition holds, bounded by maxIterations

import React from "react";
import { NodeShell } from "./NodeShell";
import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";
import { useWorkflowActions } from "../WorkflowHooks";

interface Props {
  node: AnyWorkflowNode<"loop">;
  selected: boolean;
  onStartConnection: (nodeId: string, p: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
}

export function LoopNode({ node, selected, onStartConnection, onFinishConnection }: Props) {
  const { updateNodeConfig } = useWorkflowActions();
  return (
    <NodeShell node={node} selected={selected} onStartConnection={onStartConnection} onFinishConnection={onFinishConnection}>
      <input
        className="wf-input"
        value={node.config.condition}
        onChange={(e) => updateNodeConfig(node.id, { condition: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder="loop while..."
      />
      <div className="wf-node-row wf-node-row-small">
        <input
          type="number"
          className="wf-input wf-input-tiny"
          value={node.config.maxIterations}
          onChange={(e) => updateNodeConfig(node.id, { maxIterations: Number(e.target.value) })}
          onPointerDown={(e) => e.stopPropagation()}
        />
        <span>max iter</span>
      </div>
    </NodeShell>
  );
}
