// WorkflowTypes.ts — shared type contracts for the Workflow builder

export type NodeKind =
  | "start"
  | "end"
  | "task"
  | "branch"
  | "decision"
  | "delay"
  | "loop"
  | "variable"
  | "merge";

export type PortDirection = "in" | "out";

export interface Port {
  id: string;
  nodeId: string;
  direction: PortDirection;
  label?: string;
}

export interface Vec2 {
  x: number;
  y: number;
}

export interface NodeConfigMap {
  start: {};
  end: { status: "success" | "failure" | "neutral" };
  task: { action: string; timeoutMs: number; retries: number };
  branch: { condition: string };
  decision: { expression: string; trueLabel: string; falseLabel: string };
  delay: { durationMs: number };
  loop: { condition: string; maxIterations: number };
  variable: { name: string; operation: "set" | "increment" | "append"; value: string };
  merge: { strategy: "all" | "any" };
}

export interface WorkflowNode<K extends NodeKind = NodeKind> {
  id: string;
  kind: K;
  title: string;
  position: Vec2;
  size: Vec2;
  zIndex: number;
  hidden: boolean;
  locked: boolean;
  config: NodeConfigMap[K];
  createdAt: number;
}

export type AnyWorkflowNode = WorkflowNode<NodeKind>;

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  sourcePort: PortDirection extends never ? never : "out";
  targetNodeId: string;
  targetPort: "in";
  label?: string;
  condition?: "true" | "false" | "default";
  animated: boolean;
  selected: boolean;
}

export type VariableType = "string" | "number" | "boolean" | "json";

export interface WorkflowVariable {
  id: string;
  name: string;
  type: VariableType;
  value: string | number | boolean | Record<string, unknown>;
  scope: "global" | "local";
}

export interface ConsoleEntry {
  id: string;
  timestamp: number;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  nodeId?: string;
}

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

export type ExecutionStatus = "idle" | "running" | "paused" | "completed" | "errored";

export interface ExecutionFrame {
  nodeId: string;
  enteredAt: number;
  exitedAt?: number;
  outcome?: "true" | "false" | "default" | "error";
}

export interface WorkflowDocument {
  id: string;
  name: string;
  nodes: AnyWorkflowNode[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
  camera: CameraState;
  updatedAt: number;
}

export const NODE_COLORS: Record<NodeKind, string> = {
  start: "#2e8b57",
  end: "#8b2e2e",
  task: "#2e6f8b",
  branch: "#8b6f2e",
  decision: "#6f2e8b",
  delay: "#4a4a4a",
  loop: "#2e8b7a",
  variable: "#8b2e6f",
  merge: "#5a5a2e",
};

export const NODE_DEFAULT_SIZE: Record<NodeKind, Vec2> = {
  start: { x: 120, y: 56 },
  end: { x: 120, y: 56 },
  task: { x: 180, y: 76 },
  branch: { x: 180, y: 88 },
  decision: { x: 190, y: 88 },
  delay: { x: 160, y: 68 },
  loop: { x: 180, y: 88 },
  variable: { x: 180, y: 76 },
  merge: { x: 160, y: 68 },
};

export function defaultConfigFor<K extends NodeKind>(kind: K): NodeConfigMap[K] {
  const map: NodeConfigMap = {
    start: {},
    end: { status: "success" },
    task: { action: "run", timeoutMs: 5000, retries: 0 },
    branch: { condition: "true" },
    decision: { expression: "value > 0", trueLabel: "Yes", falseLabel: "No" },
    delay: { durationMs: 1000 },
    loop: { condition: "true", maxIterations: 10 },
    variable: { name: "var1", operation: "set", value: "" },
    merge: { strategy: "all" },
  };
  return map[kind] as NodeConfigMap[K];
}
