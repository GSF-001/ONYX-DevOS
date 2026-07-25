// Redo.ts — thin wrapper exposing redo as an action + keyboard binding helper

import { historyManager } from "./History";
import { workflowStore } from "../WorkflowStore";

export function redo(): void {
  const ok = historyManager.redo();
  if (ok) workflowStore.log("debug", "Redo applied");
  else workflowStore.log("warn", "Nothing to redo");
}

export function bindRedoShortcut(target: Window = window): () => void {
  const handler = (e: KeyboardEvent) => {
    const isRedoCombo = (e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"));
    if (isRedoCombo) {
      e.preventDefault();
      redo();
    }
  };
  target.addEventListener("keydown", handler);
  return () => target.removeEventListener("keydown", handler);
}
