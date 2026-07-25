/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// WorkflowHooks.ts — React bindings for WorkflowStore

import { useCallback, useSyncExternalStore } from "react";
import { workflowStore } from "./WorkflowStore";
import { AnyWorkflowNode, WorkflowEdge } from "./WorkflowTypes";

export function useWorkflowState() {
  return useSyncExternalStore(workflowStore.subscribe, workflowStore.getState, workflowStore.getState);
}

export function useNodes(): AnyWorkflowNode[] {
  const state = useWorkflowState();
  return state.doc.nodes;
}

export function useEdges(): WorkflowEdge[] {
  const state = useWorkflowState();
  return state.doc.edges;
}

export function useVariables() {
  const state = useWorkflowState();
  return state.doc.variables;
}

export function useConsole() {
  const state = useWorkflowState();
  return state.console;
}

export function useSelectedNodes(): AnyWorkflowNode[] {
  const state = useWorkflowState();
  return state.doc.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
}

export function useSelectedNode(): AnyWorkflowNode | null {
  const nodes = useSelectedNodes();
  return nodes.length === 1 ? nodes[0] : null;
}

export function useCamera() {
  const state = useWorkflowState();
  return state.doc.camera;
}

export function useExecutionStatus() {
  const state = useWorkflowState();
  return { status: state.executionStatus, activeNodeId: state.activeNodeId };
}

export function useNodeById(id: string | null): AnyWorkflowNode | undefined {
  const nodes = useNodes();
  return id ? nodes.find((n) => n.id === id) : undefined;
}

export function useWorkflowActions() {
  return {
    addNode: useCallback(workflowStore.addNode.bind(workflowStore), []),
    updateNode: useCallback(workflowStore.updateNode.bind(workflowStore), []),
    updateNodeConfig: useCallback(workflowStore.updateNodeConfig.bind(workflowStore), []),
    removeNode: useCallback(workflowStore.removeNode.bind(workflowStore), []),
    bringToFront: useCallback(workflowStore.bringToFront.bind(workflowStore), []),
    addEdge: useCallback(workflowStore.addEdge.bind(workflowStore), []),
    removeEdge: useCallback(workflowStore.removeEdge.bind(workflowStore), []),
    selectNodes: useCallback(workflowStore.selectNodes.bind(workflowStore), []),
    toggleNodeSelection: useCallback(workflowStore.toggleNodeSelection.bind(workflowStore), []),
    selectEdge: useCallback(workflowStore.selectEdge.bind(workflowStore), []),
    clearSelection: useCallback(workflowStore.clearSelection.bind(workflowStore), []),
    setVariable: useCallback(workflowStore.setVariable.bind(workflowStore), []),
    removeVariable: useCallback(workflowStore.removeVariable.bind(workflowStore), []),
    setCamera: useCallback(workflowStore.setCamera.bind(workflowStore), []),
    log: useCallback(workflowStore.log.bind(workflowStore), []),
    clearConsole: useCallback(workflowStore.clearConsole.bind(workflowStore), []),
    toggleBreakpoint: useCallback(workflowStore.toggleBreakpoint.bind(workflowStore), []),
    renameDocument: useCallback(workflowStore.renameDocument.bind(workflowStore), []),
  };
}
