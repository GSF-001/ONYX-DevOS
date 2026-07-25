/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Undo.ts — thin wrapper exposing undo as an action + keyboard binding helper

import { historyManager } from "./History";
import { workflowStore } from "../WorkflowStore";

export function undo(): void {
  const ok = historyManager.undo();
  if (ok) workflowStore.log("debug", "Undo applied");
  else workflowStore.log("warn", "Nothing to undo");
}

export function bindUndoShortcut(target: Window = window): () => void {
  const handler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
    }
  };
  target.addEventListener("keydown", handler);
  return () => target.removeEventListener("keydown", handler);
}
