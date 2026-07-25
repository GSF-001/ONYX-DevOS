// PNG.ts — rasterizes the workflow graph to a PNG using the Canvas 2D API

import { WorkflowDocument, NODE_COLORS, AnyWorkflowNode } from "../WorkflowTypes";
import { computeRoute } from "../Connections/SmartRouting";
import { workflowStore } from "../WorkflowStore";

const PADDING = 60;

function bounds(nodes: AnyWorkflowNode[]) {
  const minX = Math.min(...nodes.map((n) => n.position.x));
  const minY = Math.min(...nodes.map((n) => n.position.y));
  const maxX = Math.max(...nodes.map((n) => n.position.x + n.size.x));
  const maxY = Math.max(...nodes.map((n) => n.position.y + n.size.y));
  return { minX, minY, maxX, maxY };
}

export function renderToCanvas(doc: WorkflowDocument, scale = 2): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  if (doc.nodes.length === 0) {
    canvas.width = 200;
    canvas.height = 80;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f0efe9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#333";
    ctx.font = "14px Tahoma";
    ctx.fillText("Empty workflow", 10, 40);
    return canvas;
  }

  const { minX, minY, maxX, maxY } = bounds(doc.nodes);
  const width = maxX - minX + PADDING * 2;
  const height = maxY - minY + PADDING * 2;
  const shiftX = PADDING - minX;
  const shiftY = PADDING - minY;

  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f0efe9";
  ctx.fillRect(0, 0, width, height);

  const byId = new Map(doc.nodes.map((n) => [n.id, n]));
  const shifted = new Map(
    doc.nodes.map((n) => [
      n.id,
      { ...n, position: { x: n.position.x + shiftX, y: n.position.y + shiftY } } as AnyWorkflowNode,
    ])
  );

  // Edges first so nodes draw on top
  ctx.strokeStyle = "#555555";
  ctx.lineWidth = 1.75;
  doc.edges.forEach((e) => {
    const source = shifted.get(e.sourceNodeId);
    const target = shifted.get(e.targetNodeId);
    if (!source || !target) return;
    const route = computeRoute(source, target, Array.from(shifted.values()));
    const path = new Path2D(route.d);
    ctx.stroke(path);
    drawArrowhead(ctx, target);
  });

  // Nodes
  shifted.forEach((n) => {
    const color = NODE_COLORS[n.kind];
    ctx.fillStyle = "#d4d0c8";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    roundRect(ctx, n.position.x, n.position.y, n.size.x, n.size.y, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    roundRect(ctx, n.position.x, n.position.y, n.size.x, 20, 4);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "11px Tahoma, sans-serif";
    ctx.fillText(n.title, n.position.x + 8, n.position.y + 14);

    ctx.fillStyle = "#222222";
    ctx.font = "10px Tahoma, sans-serif";
    ctx.fillText(n.kind, n.position.x + 8, n.position.y + n.size.y - 8);
  });

  return canvas;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawArrowhead(ctx: CanvasRenderingContext2D, target: AnyWorkflowNode) {
  const tip = { x: target.position.x, y: target.position.y + target.size.y / 2 };
  ctx.save();
  ctx.fillStyle = "#555555";
  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(tip.x - 8, tip.y - 4);
  ctx.lineTo(tip.x - 8, tip.y + 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export async function downloadPNG(doc: WorkflowDocument = workflowStore.getState().doc, scale = 2): Promise<void> {
  const canvas = renderToCanvas(doc, scale);
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    workflowStore.log("error", "PNG export failed: canvas.toBlob returned null");
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.name.replace(/\s+/g, "_")}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
