/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// History/Snapshot.ts
// Deep-clone snapshots of whiteboard state for time-travel / autosave.

import { WhiteboardState } from "../WhiteboardTypes";

export interface Snapshot {
  id: string;
  timestamp: number;
  state: WhiteboardState;
  label?: string;
}

export function createSnapshot(state: WhiteboardState, label?: string): Snapshot {
  return {
    id: `snap_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    state: JSON.parse(JSON.stringify(state)),
    label,
  };
}

export function restoreSnapshot(snapshot: Snapshot): WhiteboardState {
  return JSON.parse(JSON.stringify(snapshot.state));
}

export class SnapshotManager {
  private snapshots: Snapshot[] = [];
  private capacity: number;

  constructor(capacity = 50) {
    this.capacity = capacity;
  }

  capture(state: WhiteboardState, label?: string): Snapshot {
    const snap = createSnapshot(state, label);
    this.snapshots.push(snap);
    if (this.snapshots.length > this.capacity) {
      this.snapshots.shift();
    }
    return snap;
  }

  list(): Snapshot[] {
    return [...this.snapshots];
  }

  getById(id: string): Snapshot | undefined {
    return this.snapshots.find((s) => s.id === id);
  }

  clear() {
    this.snapshots = [];
  }

  serialize(): string {
    return JSON.stringify(this.snapshots);
  }

  deserialize(json: string) {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) this.snapshots = parsed;
    } catch {
      // ignore malformed payloads
    }
  }
}
