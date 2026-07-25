// WorkflowAPI.ts — persistence layer (localStorage-backed, swappable for a real backend)

import { workflowStore } from "./WorkflowStore";
import { WorkflowDocument } from "./WorkflowTypes";

const STORAGE_PREFIX = "onyx.workflow.";
const INDEX_KEY = "onyx.workflow.index";

function readIndex(): string[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIndex(ids: string[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(Array.from(new Set(ids))));
}

export const WorkflowAPI = {
  save(doc: WorkflowDocument = workflowStore.getState().doc): void {
    localStorage.setItem(STORAGE_PREFIX + doc.id, JSON.stringify(doc));
    const idx = readIndex();
    if (!idx.includes(doc.id)) writeIndex([...idx, doc.id]);
    workflowStore.log("info", `Workflow "${doc.name}" saved`);
  },

  load(id: string): WorkflowDocument | null {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    if (!raw) return null;
    try {
      const doc = JSON.parse(raw) as WorkflowDocument;
      workflowStore.loadDocument(doc);
      workflowStore.log("info", `Workflow "${doc.name}" loaded`);
      return doc;
    } catch (err) {
      workflowStore.log("error", `Failed to parse workflow ${id}: ${String(err)}`);
      return null;
    }
  },

  list(): { id: string; name: string; updatedAt: number }[] {
    return readIndex()
      .map((id) => {
        const raw = localStorage.getItem(STORAGE_PREFIX + id);
        if (!raw) return null;
        try {
          const doc = JSON.parse(raw) as WorkflowDocument;
          return { id: doc.id, name: doc.name, updatedAt: doc.updatedAt };
        } catch {
          return null;
        }
      })
      .filter((v): v is { id: string; name: string; updatedAt: number } => v !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },

  remove(id: string): void {
    localStorage.removeItem(STORAGE_PREFIX + id);
    writeIndex(readIndex().filter((x) => x !== id));
  },

  duplicate(id: string): WorkflowDocument | null {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    if (!raw) return null;
    const doc = JSON.parse(raw) as WorkflowDocument;
    const copy: WorkflowDocument = {
      ...doc,
      id: `wf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      name: `${doc.name} (Copy)`,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_PREFIX + copy.id, JSON.stringify(copy));
    writeIndex([...readIndex(), copy.id]);
    return copy;
  },

  validate(doc: WorkflowDocument): string[] {
    const errors: string[] = [];
    const starts = doc.nodes.filter((n) => n.kind === "start");
    if (starts.length === 0) errors.push("Workflow has no Start node.");
    if (starts.length > 1) errors.push("Workflow has more than one Start node.");
    const ends = doc.nodes.filter((n) => n.kind === "end");
    if (ends.length === 0) errors.push("Workflow has no End node.");
    const nodeIds = new Set(doc.nodes.map((n) => n.id));
    doc.edges.forEach((e) => {
      if (!nodeIds.has(e.sourceNodeId) || !nodeIds.has(e.targetNodeId)) {
        errors.push(`Edge ${e.id} references a missing node.`);
      }
    });
    const reachable = new Set<string>();
    const startId = starts[0]?.id;
    if (startId) {
      const stack = [startId];
      while (stack.length) {
        const cur = stack.pop()!;
        if (reachable.has(cur)) continue;
        reachable.add(cur);
        doc.edges.filter((e) => e.sourceNodeId === cur).forEach((e) => stack.push(e.targetNodeId));
      }
      doc.nodes.forEach((n) => {
        if (!reachable.has(n.id)) errors.push(`Node "${n.title}" is unreachable from Start.`);
      });
    }
    return errors;
  },
};
