/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Breakpoint.ts — tracks which node IDs pause execution when hit

class BreakpointManager {
  private points = new Set<string>();

  toggle(nodeId: string): boolean {
    if (this.points.has(nodeId)) {
      this.points.delete(nodeId);
      return false;
    }
    this.points.add(nodeId);
    return true;
  }

  has(nodeId: string): boolean {
    return this.points.has(nodeId);
  }

  clearAll(): void {
    this.points.clear();
  }

  all(): string[] {
    return Array.from(this.points);
  }
}

export const breakpointManager = new BreakpointManager();
