// BranchNode.tsx — fans out to multiple downstream edges based on a boolean condition string

import React from "react";
import { NodeShell } from "./NodeShell";
import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";
import { useWorkflowActions } from "../WorkflowHooks";

interface Props {
  node: AnyWorkflowNode<"branch">;
  selected: boolean;
  onStartConnection: (nodeId: string, p: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
}

export function BranchNode({ node, selected, onStartConnection, onFinishConnection }: Props) {
  const { updateNodeConfig } = useWorkflowActions();
  return (
    <NodeShell node={node} selected={selected} onStartConnection={onStartConnection} onFinishConnection={onFinishConnection}>
      <input
        className="wf-input"
        value={node.config.condition}
        onChange={(e) => updateNodeConfig(node.id, { condition: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder="e.g. score > 50"
      />
    </NodeShell>
  );
}
