/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Nodes/index.ts — barrel + kind→component registry

import { StartNode } from "./StartNode";
import { EndNode } from "./EndNode";
import { TaskNode } from "./TaskNode";
import { BranchNode } from "./BranchNode";
import { DecisionNode } from "./DecisionNode";
import { DelayNode } from "./DelayNode";
import { LoopNode } from "./LoopNode";
import { VariableNode } from "./VariableNode";
import { MergeNode } from "./MergeNode";
import { NodeKind } from "../WorkflowTypes";

export { StartNode, EndNode, TaskNode, BranchNode, DecisionNode, DelayNode, LoopNode, VariableNode, MergeNode };

export const NODE_COMPONENTS: Record<NodeKind, React.ComponentType<any>> = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  branch: BranchNode,
  decision: DecisionNode,
  delay: DelayNode,
  loop: LoopNode,
  variable: VariableNode,
  merge: MergeNode,
};

export const NODE_LIBRARY_ITEMS: { kind: NodeKind; label: string; description: string }[] = [
  { kind: "start", label: "Start", description: "Entry point of the workflow" },
  { kind: "task", label: "Task", description: "Runs a single action" },
  { kind: "branch", label: "Branch", description: "Splits flow by condition" },
  { kind: "decision", label: "Decision", description: "True/false expression gate" },
  { kind: "delay", label: "Delay", description: "Waits before continuing" },
  { kind: "loop", label: "Loop", description: "Repeats while condition holds" },
  { kind: "variable", label: "Variable", description: "Sets or mutates a variable" },
  { kind: "merge", label: "Merge", description: "Joins branches back together" },
  { kind: "end", label: "End", description: "Terminates the workflow" },
];
