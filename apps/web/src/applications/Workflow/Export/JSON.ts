/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// JSON.ts — serialize/deserialize a WorkflowDocument with validation

import { WorkflowAPI } from "../WorkflowAPI";
import { WorkflowDocument } from "../WorkflowTypes";
import { workflowStore } from "../WorkflowStore";

export function exportJSON(doc: WorkflowDocument = workflowStore.getState().doc): string {
  return JSON.stringify(doc, null, 2);
}

export function downloadJSON(doc: WorkflowDocument = workflowStore.getState().doc): void {
  const blob = new Blob([exportJSON(doc)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.name.replace(/\s+/g, "_")}.workflow.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function importJSON(raw: string): { doc: WorkflowDocument | null; errors: string[] } {
  try {
    const doc = JSON.parse(raw) as WorkflowDocument;
    if (!doc.nodes || !doc.edges) {
      return { doc: null, errors: ["File does not look like a valid workflow document."] };
    }
    const errors = WorkflowAPI.validate(doc);
    workflowStore.loadDocument(doc);
    return { doc, errors };
  } catch (err) {
    return { doc: null, errors: [`Could not parse JSON: ${String(err)}`] };
  }
}
