// VariableNode.tsx — mutates a named workflow variable (set / increment / append)

import React from "react";
import { NodeShell } from "./NodeShell";
import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";
import { useWorkflowActions } from "../WorkflowHooks";

interface Props {
  node: AnyWorkflowNode<"variable">;
  selected: boolean;
  onStartConnection: (nodeId: string, p: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
}

export function VariableNode({ node, selected, onStartConnection, onFinishConnection }: Props) {
  const { updateNodeConfig } = useWorkflowActions();
  return (
    <NodeShell node={node} selected={selected} onStartConnection={onStartConnection} onFinishConnection={onFinishConnection}>
      <div className="wf-node-row wf-node-row-small">
        <input
          className="wf-input wf-input-tiny"
          value={node.config.name}
          onChange={(e) => updateNodeConfig(node.id, { name: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="name"
        />
        <select
          className="wf-select"
          value={node.config.operation}
          onChange={(e) => updateNodeConfig(node.id, { operation: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <option value="set">set</option>
          <option value="increment">+= </option>
          <option value="append">append</option>
        </select>
      </div>
      <input
        className="wf-input"
        value={node.config.value}
        onChange={(e) => updateNodeConfig(node.id, { value: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder="value"
      />
    </NodeShell>
  );
}
