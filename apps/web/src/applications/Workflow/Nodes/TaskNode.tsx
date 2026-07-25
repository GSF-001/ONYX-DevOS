/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// TaskNode.tsx — executes a single named action with timeout + retry policy

import React from "react";
import { NodeShell } from "./NodeShell";
import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";
import { useWorkflowActions } from "../WorkflowHooks";

interface Props {
  node: AnyWorkflowNode<"task">;
  selected: boolean;
  onStartConnection: (nodeId: string, p: Vec2) => void;
  onFinishConnection: (nodeId: string) => void;
}

export function TaskNode({ node, selected, onStartConnection, onFinishConnection }: Props) {
  const { updateNodeConfig } = useWorkflowActions();
  return (
    <NodeShell node={node} selected={selected} onStartConnection={onStartConnection} onFinishConnection={onFinishConnection}>
      <input
        className="wf-input"
        value={node.config.action}
        onChange={(e) => updateNodeConfig(node.id, { action: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder="action name"
      />
      <div className="wf-node-row wf-node-row-small">
        <span>{node.config.timeoutMs}ms</span>
        <span>{node.config.retries} retries</span>
      </div>
    </NodeShell>
  );
}
