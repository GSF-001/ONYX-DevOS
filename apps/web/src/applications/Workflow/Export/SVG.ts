/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// SVG.ts — renders the full workflow graph to a standalone SVG string

import { WorkflowDocument } from "../WorkflowTypes";
import { computeRoute } from "../Connections/SmartRouting";
import { NODE_COLORS } from "../WorkflowTypes";
import { workflowStore } from "../WorkflowStore";

export function exportSVG(doc: WorkflowDocument = workflowStore.getState().doc): string {
  if (doc.nodes.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><text x="10" y="40">Empty workflow</text></svg>`;
  }

  const padding = 60;
  const maxX = Math.max(...doc.nodes.map((n) => n.position.x + n.size.x));
  const maxY = Math.max(...doc.nodes.map((n) => n.position.y + n.size.y));
  const minX = Math.min(...doc.nodes.map((n) => n.position.x));
  const minY = Math.min(...doc.nodes.map((n) => n.position.y));
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const shift = { x: padding - minX, y: padding - minY };

  const byId = new Map(doc.nodes.map((n) => [n.id, n]));

  const edgeMarkup = doc.edges
    .map((e) => {
      const source = byId.get(e.sourceNodeId);
      const target = byId.get(e.targetNodeId);
      if (!source || !target) return "";
      const shiftedSource = { ...source, position: { x: source.position.x + shift.x, y: source.position.y + shift.y } };
      const shiftedTarget = { ...target, position: { x: target.position.x + shift.x, y: target.position.y + shift.y } };
      const route = computeRoute(shiftedSource, shiftedTarget, doc.nodes);
      return `<path d="${route.d}" fill="none" stroke="#555" stroke-width="1.75" marker-end="url(#arrow)" />`;
    })
    .join("\n");

  const nodeMarkup = doc.nodes
    .map((n) => {
      const x = n.position.x + shift.x;
      const y = n.position.y + shift.y;
      const color = NODE_COLORS[n.kind];
      return `
        <g>
          <rect x="${x}" y="${y}" width="${n.size.x}" height="${n.size.y}" rx="4" fill="#d4d0c8" stroke="${color}" stroke-width="2" />
          <rect x="${x}" y="${y}" width="${n.size.x}" height="20" rx="4" fill="${color}" />
          <text x="${x + 8}" y="${y + 14}" font-size="11" fill="#fff" font-family="Tahoma, sans-serif">${escapeXML(n.title)}</text>
          <text x="${x + 8}" y="${y + n.size.y - 8}" font-size="10" fill="#222" font-family="Tahoma, sans-serif">${escapeXML(n.kind)}</text>
        </g>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#555" />
      </marker>
    </defs>
    <rect width="100%" height="100%" fill="#f0efe9" />
    ${edgeMarkup}
    ${nodeMarkup}
  </svg>`;
}

function escapeXML(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function downloadSVG(doc: WorkflowDocument = workflowStore.getState().doc): void {
  const svg = exportSVG(doc);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.name.replace(/\s+/g, "_")}.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
