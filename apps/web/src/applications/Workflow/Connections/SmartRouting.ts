// SmartRouting.ts — computes a smooth cubic-bezier path between two node ports,
// nudging the control points around any node whose bounding box the straight line would cross.

import { AnyWorkflowNode, Vec2 } from "../WorkflowTypes";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function nodeRect(n: AnyWorkflowNode): Rect {
  return { x: n.position.x, y: n.position.y, w: n.size.x, h: n.size.y };
}

function segmentIntersectsRect(p1: Vec2, p2: Vec2, r: Rect): boolean {
  // Liang-Barsky style check against the four rect edges via simple sampling
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = p1.x + (p2.x - p1.x) * t;
    const y = p1.y + (p2.y - p1.y) * t;
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return true;
  }
  return false;
}

export interface RoutedPath {
  d: string;
  midpoint: Vec2;
  length: number;
}

export function outputPortPoint(node: AnyWorkflowNode): Vec2 {
  return { x: node.position.x + node.size.x, y: node.position.y + node.size.y / 2 };
}

export function inputPortPoint(node: AnyWorkflowNode): Vec2 {
  return { x: node.position.x, y: node.position.y + node.size.y / 2 };
}

export function computeRoute(source: AnyWorkflowNode, target: AnyWorkflowNode, obstacles: AnyWorkflowNode[]): RoutedPath {
  const p1 = outputPortPoint(source);
  const p2 = inputPortPoint(target);
  const dx = Math.max(60, Math.abs(p2.x - p1.x) * 0.5);

  let c1: Vec2 = { x: p1.x + dx, y: p1.y };
  let c2: Vec2 = { x: p2.x - dx, y: p2.y };

  const blockers = obstacles.filter((n) => n.id !== source.id && n.id !== target.id);
  const crosses = blockers.some((n) => segmentIntersectsRect(p1, p2, nodeRect(n)));

  if (crosses || p2.x < p1.x) {
    // Route around: push the curve vertically away from the midline based on relative position
    const bias = target.position.y >= source.position.y ? 1 : -1;
    const lift = 90 * bias;
    c1 = { x: p1.x + dx, y: p1.y + lift };
    c2 = { x: p2.x - dx, y: p2.y + lift };
  }

  const d = `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  const midpoint = bezierPointAt(p1, c1, c2, p2, 0.5);
  const length = Math.hypot(p2.x - p1.x, p2.y - p1.y) * 1.15;
  return { d, midpoint, length };
}

function bezierPointAt(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const mt = 1 - t;
  const x = mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x;
  const y = mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y;
  return { x, y };
}
