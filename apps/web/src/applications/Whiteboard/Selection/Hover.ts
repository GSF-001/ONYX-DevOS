// Selection/Hover.ts

import { Point, WhiteboardObject } from "../WhiteboardTypes";
import { hitTestTopmost } from "./HitTest";

export class HoverController {
  private currentId: string | null = null;
  private listeners: Set<(id: string | null) => void> = new Set();

  onChange(listener: (id: string | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  updateFromPoint(point: Point, objects: WhiteboardObject[]) {
    const hit = hitTestTopmost(point, objects);
    const nextId = hit ? hit.id : null;
    if (nextId !== this.currentId) {
      this.currentId = nextId;
      this.listeners.forEach((l) => l(this.currentId));
    }
  }

  clear() {
    if (this.currentId !== null) {
      this.currentId = null;
      this.listeners.forEach((l) => l(null));
    }
  }

  getCurrent(): string | null {
    return this.currentId;
  }
}

export function getHoverCursor(obj: WhiteboardObject | null, locked: boolean): string {
  if (!obj) return "default";
  if (locked || obj.locked) return "not-allowed";
  return "move";
}
