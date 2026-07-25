/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// History/CommandStack.ts
// Generic command-pattern stack used to power undo/redo.

import { Command } from "../WhiteboardTypes";

export class CommandStack {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private maxSize: number;

  constructor(maxSize = 200) {
    this.maxSize = maxSize;
  }

  execute(command: Command) {
    command.do();
    this.undoStack.push(command);
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  undo(): Command | null {
    const command = this.undoStack.pop();
    if (!command) return null;
    command.undo();
    this.redoStack.push(command);
    return command;
  }

  redo(): Command | null {
    const command = this.redoStack.pop();
    if (!command) return null;
    command.do();
    this.undoStack.push(command);
    return command;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  peekUndo(): Command | null {
    return this.undoStack[this.undoStack.length - 1] ?? null;
  }

  peekRedo(): Command | null {
    return this.redoStack[this.redoStack.length - 1] ?? null;
  }

  getHistoryLabels(): { undo: string[]; redo: string[] } {
    return {
      undo: this.undoStack.map((c) => c.label),
      redo: this.redoStack.map((c) => c.label),
    };
  }
}
