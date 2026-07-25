/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// History/UndoRedo.ts
// High-level undo/redo manager that binds a WhiteboardStore to a CommandStack.

import { WhiteboardStore } from "../WhiteboardStore";
import { WhiteboardObject } from "../WhiteboardTypes";
import { CommandStack } from "./CommandStack";

export class UndoRedoManager {
  private store: WhiteboardStore;
  private stack: CommandStack;

  constructor(store: WhiteboardStore, maxSize = 200) {
    this.store = store;
    this.stack = new CommandStack(maxSize);
  }

  recordAddObject(obj: WhiteboardObject) {
    this.stack.execute({
      id: `cmd_add_${obj.id}`,
      label: `Add ${obj.type}`,
      do: () => this.store.addObject(obj),
      undo: () => this.store.removeObject(obj.id),
      timestamp: Date.now(),
    });
  }

  recordRemoveObjects(objs: WhiteboardObject[]) {
    const ids = objs.map((o) => o.id);
    this.stack.execute({
      id: `cmd_remove_${ids.join("_")}`,
      label: `Delete ${objs.length} object(s)`,
      do: () => this.store.removeObjects(ids),
      undo: () => objs.forEach((o) => this.store.addObject(o)),
      timestamp: Date.now(),
    });
  }

  recordUpdateObject(
    id: string,
    before: Partial<WhiteboardObject>,
    after: Partial<WhiteboardObject>
  ) {
    this.stack.execute({
      id: `cmd_update_${id}_${Date.now()}`,
      label: "Update object",
      do: () => this.store.updateObject(id, after),
      undo: () => this.store.updateObject(id, before),
      timestamp: Date.now(),
    });
  }

  recordBatchMove(
    moves: { id: string; before: { x: number; y: number }; after: { x: number; y: number } }[]
  ) {
    this.stack.execute({
      id: `cmd_move_${Date.now()}`,
      label: `Move ${moves.length} object(s)`,
      do: () =>
        moves.forEach((m) => this.store.updateObject(m.id, { x: m.after.x, y: m.after.y })),
      undo: () =>
        moves.forEach((m) => this.store.updateObject(m.id, { x: m.before.x, y: m.before.y })),
      timestamp: Date.now(),
    });
  }

  undo() {
    return this.stack.undo();
  }

  redo() {
    return this.stack.redo();
  }

  canUndo() {
    return this.stack.canUndo();
  }

  canRedo() {
    return this.stack.canRedo();
  }

  clear() {
    this.stack.clear();
  }
}
