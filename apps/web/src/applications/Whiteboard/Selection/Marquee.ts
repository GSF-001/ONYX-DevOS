/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Selection/Marquee.ts

import { Point, Rect } from "../WhiteboardTypes";

export function rectFromPoints(start: Point, end: Point): Rect {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

export class MarqueeController {
  private startPoint: Point | null = null;
  private active = false;

  begin(point: Point) {
    this.startPoint = point;
    this.active = true;
  }

  update(current: Point): Rect | null {
    if (!this.active || !this.startPoint) return null;
    return rectFromPoints(this.startPoint, current);
  }

  end(): void {
    this.active = false;
    this.startPoint = null;
  }

  isActive(): boolean {
    return this.active;
  }
}

export function isMarqueeMeaningful(rect: Rect, minSize = 3): boolean {
  return rect.width > minSize || rect.height > minSize;
}
