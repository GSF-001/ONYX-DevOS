/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// EndNode.tsx — terminal node; execution stops here and reports final status

import React from "react";
import { NodeShell } from "./NodeShell";
import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";
import { useWorkflowActions } from "../WorkflowHooks";

interface Props {
  node: AnyWorkflowNode<"end">;
  selected: boolean;
  onStartConnection: (nodeId: string, p: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
}

export function EndNode({ node, selected, onStartConnection, onFinishConnection }: Props) {
  const { updateNodeConfig } = useWorkflowActions();
  return (
    <NodeShell node={node} selected={selected} onStartConnection={onStartConnection} onFinishConnection={onFinishConnection}>
      <select
        className="wf-select"
        value={node.config.status}
        onChange={(e) => updateNodeConfig(node.id, { status: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <option value="success">Success</option>
        <option value="failure">Failure</option>
        <option value="neutral">Neutral</option>
      </select>
    </NodeShell>
  );
}
