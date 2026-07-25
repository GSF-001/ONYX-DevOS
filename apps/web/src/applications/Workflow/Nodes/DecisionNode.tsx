/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// DecisionNode.tsx — evaluates an expression against variables, produces true/false outcome

import React from "react";
import { NodeShell } from "./NodeShell";
import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";
import { useWorkflowActions } from "../WorkflowHooks";

interface Props {
  node: AnyWorkflowNode<"decision">;
  selected: boolean;
  onStartConnection: (nodeId: string, p: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
}

export function DecisionNode({ node, selected, onStartConnection, onFinishConnection }: Props) {
  const { updateNodeConfig } = useWorkflowActions();
  return (
    <NodeShell node={node} selected={selected} onStartConnection={onStartConnection} onFinishConnection={onFinishConnection}>
      <input
        className="wf-input"
        value={node.config.expression}
        onChange={(e) => updateNodeConfig(node.id, { expression: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder="expression"
      />
      <div className="wf-node-row wf-node-row-small">
        <input
          className="wf-input wf-input-tiny"
          value={node.config.trueLabel}
          onChange={(e) => updateNodeConfig(node.id, { trueLabel: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
        />
        <input
          className="wf-input wf-input-tiny"
          value={node.config.falseLabel}
          onChange={(e) => updateNodeConfig(node.id, { falseLabel: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </div>
    </NodeShell>
  );
}
