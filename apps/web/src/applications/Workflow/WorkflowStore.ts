/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// WorkflowStore.ts — pub/sub store for the Workflow module (no external deps)

import {
  AnyWorkflowNode,
  CameraState,
  ConsoleEntry,
  ExecutionStatus,
  NodeKind,
  WorkflowDocument,
  WorkflowEdge,
  WorkflowVariable,
  defaultConfigFor,
  NODE_DEFAULT_SIZE,
} from "./WorkflowTypes";

type Listener = () => void;

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface WorkflowState {
  doc: WorkflowDocument;
  selectedNodeIds: string[];
  selectedEdgeId: string | null;
  console: ConsoleEntry[];
  executionStatus: ExecutionStatus;
  activeNodeId: string | null;
  breakpoints: Set<string>;
}

function emptyDocument(): WorkflowDocument {
  const now = Date.now();
  return {
    id: uid("wf"),
    name: "Untitled Workflow",
    nodes: [],
    edges: [],
    variables: [],
    camera: { x: 0, y: 0, zoom: 1 },
    updatedAt: now,
  };
}

class WorkflowStoreImpl {
  private state: WorkflowState = {
    doc: emptyDocument(),
    selectedNodeIds: [],
    selectedEdgeId: null,
    console: [],
    executionStatus: "idle",
    activeNodeId: null,
    breakpoints: new Set(),
  };

  private listeners = new Set<Listener>();

  getState = (): WorkflowState => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private emit() {
    this.state = { ...this.state, doc: { ...this.state.doc, updatedAt: Date.now() } };
    this.listeners.forEach((l) => l());
  }

  private patchDoc(patch: Partial<WorkflowDocument>) {
    this.state = { ...this.state, doc: { ...this.state.doc, ...patch } };
    this.emit();
  }

  // ---- Nodes ----
  addNode(kind: NodeKind, position: { x: number; y: number }): AnyWorkflowNode {
    const maxZ = this.state.doc.nodes.reduce((m, n) => Math.max(m, n.zIndex), 0);
    const node: AnyWorkflowNode = {
      id: uid("node"),
      kind,
      title: kind[0].toUpperCase() + kind.slice(1),
      position,
      size: NODE_DEFAULT_SIZE[kind],
      zIndex: maxZ + 1,
      hidden: false,
      locked: false,
      config: defaultConfigFor(kind),
      createdAt: Date.now(),
    };
    this.patchDoc({ nodes: [...this.state.doc.nodes, node] });
    this.log("info", `Node "${node.title}" added`, node.id);
    return node;
  }

  updateNode(id: string, patch: Partial<AnyWorkflowNode>) {
    this.patchDoc({
      nodes: this.state.doc.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    });
  }

  updateNodeConfig(id: string, config: Record<string, unknown>) {
    this.patchDoc({
      nodes: this.state.doc.nodes.map((n) =>
        n.id === id ? { ...n, config: { ...n.config, ...config } } : n
      ),
    });
  }

  removeNode(id: string) {
    this.patchDoc({
      nodes: this.state.doc.nodes.filter((n) => n.id !== id),
      edges: this.state.doc.edges.filter((e) => e.sourceNodeId !== id && e.targetNodeId !== id),
    });
    this.state = {
      ...this.state,
      selectedNodeIds: this.state.selectedNodeIds.filter((n) => n !== id),
    };
    this.log("warn", `Node removed`, id);
  }

  bringToFront(id: string) {
    const maxZ = this.state.doc.nodes.reduce((m, n) => Math.max(m, n.zIndex), 0);
    this.updateNode(id, { zIndex: maxZ + 1 });
  }

  // ---- Edges ----
  addEdge(sourceNodeId: string, targetNodeId: string, condition?: WorkflowEdge["condition"]): WorkflowEdge | null {
    if (sourceNodeId === targetNodeId) return null;
    const exists = this.state.doc.edges.some(
      (e) => e.sourceNodeId === sourceNodeId && e.targetNodeId === targetNodeId
    );
    if (exists) return null;
    const edge: WorkflowEdge = {
      id: uid("edge"),
      sourceNodeId,
      sourcePort: "out",
      targetNodeId,
      targetPort: "in",
      condition,
      animated: false,
      selected: false,
    };
    this.patchDoc({ edges: [...this.state.doc.edges, edge] });
    return edge;
  }

  removeEdge(id: string) {
    this.patchDoc({ edges: this.state.doc.edges.filter((e) => e.id !== id) });
  }

  setEdgeAnimated(id: string, animated: boolean) {
    this.patchDoc({
      edges: this.state.doc.edges.map((e) => (e.id === id ? { ...e, animated } : e)),
    });
  }

  // ---- Selection ----
  selectNodes(ids: string[]) {
    this.state = { ...this.state, selectedNodeIds: ids, selectedEdgeId: null };
    this.emit();
  }

  toggleNodeSelection(id: string) {
    const has = this.state.selectedNodeIds.includes(id);
    this.selectNodes(has ? this.state.selectedNodeIds.filter((n) => n !== id) : [...this.state.selectedNodeIds, id]);
  }

  selectEdge(id: string | null) {
    this.state = { ...this.state, selectedEdgeId: id, selectedNodeIds: [] };
    this.emit();
  }

  clearSelection() {
    this.state = { ...this.state, selectedNodeIds: [], selectedEdgeId: null };
    this.emit();
  }

  // ---- Variables ----
  setVariable(name: string, value: WorkflowVariable["value"], type: WorkflowVariable["type"] = "string") {
    const existing = this.state.doc.variables.find((v) => v.name === name);
    if (existing) {
      this.patchDoc({
        variables: this.state.doc.variables.map((v) => (v.name === name ? { ...v, value, type } : v)),
      });
    } else {
      const v: WorkflowVariable = { id: uid("var"), name, type, value, scope: "global" };
      this.patchDoc({ variables: [...this.state.doc.variables, v] });
    }
  }

  removeVariable(id: string) {
    this.patchDoc({ variables: this.state.doc.variables.filter((v) => v.id !== id) });
  }

  // ---- Camera ----
  setCamera(camera: Partial<CameraState>) {
    this.patchDoc({ camera: { ...this.state.doc.camera, ...camera } });
  }

  // ---- Console ----
  log(level: ConsoleEntry["level"], message: string, nodeId?: string) {
    const entry: ConsoleEntry = { id: uid("log"), timestamp: Date.now(), level, message, nodeId };
    this.state = { ...this.state, console: [...this.state.console, entry].slice(-500) };
    this.emit();
  }

  clearConsole() {
    this.state = { ...this.state, console: [] };
    this.emit();
  }

  // ---- Execution ----
  setExecutionStatus(status: ExecutionStatus) {
    this.state = { ...this.state, executionStatus: status };
    this.emit();
  }

  setActiveNode(id: string | null) {
    this.state = { ...this.state, activeNodeId: id };
    this.emit();
  }

  // ---- Breakpoints ----
  toggleBreakpoint(id: string) {
    const bp = new Set(this.state.breakpoints);
    bp.has(id) ? bp.delete(id) : bp.add(id);
    this.state = { ...this.state, breakpoints: bp };
    this.emit();
  }

  hasBreakpoint(id: string) {
    return this.state.breakpoints.has(id);
  }

  // ---- Whole-document ops (used by History/Export) ----
  loadDocument(doc: WorkflowDocument) {
    this.state = { ...this.state, doc, selectedNodeIds: [], selectedEdgeId: null };
    this.emit();
  }

  replaceGraph(nodes: AnyWorkflowNode[], edges: WorkflowEdge[], variables: WorkflowVariable[]) {
    this.patchDoc({ nodes, edges, variables });
  }

  renameDocument(name: string) {
    this.patchDoc({ name });
  }
}

export const workflowStore = new WorkflowStoreImpl();
export type { Listener };
