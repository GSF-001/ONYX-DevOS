/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// History.ts — snapshot-based undo/redo stack over the workflow graph (nodes/edges/variables)

import { workflowStore } from "../WorkflowStore";
import { AnyWorkflowNode, WorkflowEdge, WorkflowVariable } from "../WorkflowTypes";

interface Snapshot {
  nodes: AnyWorkflowNode[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
  label: string;
  timestamp: number;
}

const MAX_HISTORY = 100;

class HistoryManager {
  private past: Snapshot[] = [];
  private future: Snapshot[] = [];
  private suppress = false;

  private currentSnapshot(label: string): Snapshot {
    const doc = workflowStore.getState().doc;
    return {
      nodes: structuredClone(doc.nodes),
      edges: structuredClone(doc.edges),
      variables: structuredClone(doc.variables),
      label,
      timestamp: Date.now(),
    };
  }

  /** Call before mutating the graph to push a checkpoint. */
  record(label: string) {
    if (this.suppress) return;
    this.past.push(this.currentSnapshot(label));
    if (this.past.length > MAX_HISTORY) this.past.shift();
    this.future = [];
  }

  canUndo() {
    return this.past.length > 0;
  }

  canRedo() {
    return this.future.length > 0;
  }

  undo(): boolean {
    const prev = this.past.pop();
    if (!prev) return false;
    const doc = workflowStore.getState().doc;
    this.future.push({
      nodes: structuredClone(doc.nodes),
      edges: structuredClone(doc.edges),
      variables: structuredClone(doc.variables),
      label: prev.label,
      timestamp: Date.now(),
    });
    this.apply(prev);
    return true;
  }

  redo(): boolean {
    const next = this.future.pop();
    if (!next) return false;
    const doc = workflowStore.getState().doc;
    this.past.push({
      nodes: structuredClone(doc.nodes),
      edges: structuredClone(doc.edges),
      variables: structuredClone(doc.variables),
      label: next.label,
      timestamp: Date.now(),
    });
    this.apply(next);
    return true;
  }

  private apply(snap: Snapshot) {
    this.suppress = true;
    workflowStore.replaceGraph(snap.nodes, snap.edges, snap.variables);
    this.suppress = false;
  }

  clear() {
    this.past = [];
    this.future = [];
  }

  timeline(): { label: string; timestamp: number }[] {
    return this.past.map((s) => ({ label: s.label, timestamp: s.timestamp }));
  }
}

export const historyManager = new HistoryManager();
