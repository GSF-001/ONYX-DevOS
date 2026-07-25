// StartNode.tsx — entry point of the workflow graph (exactly one per workflow)

import React from "react";
import { NodeShell } from "./NodeShell";
import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";

interface Props {
  node: AnyWorkflowNode;
  selected: boolean;
  onStartConnection: (nodeId: string, p: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
}

export function StartNode({ node, selected, onStartConnection, onFinishConnection }: Props) {
  return (
    <NodeShell node={node} selected={selected} onStartConnection={onStartConnection} onFinishConnection={onFinishConnection}>
      <div className="wf-node-row">▶ Trigger execution</div>
    </NodeShell>
  );
}
