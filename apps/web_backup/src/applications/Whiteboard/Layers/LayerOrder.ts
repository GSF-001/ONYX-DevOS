// Layers/LayerOrder.ts

import { Layer, WhiteboardObject } from "../WhiteboardTypes";

export function sortLayersByOrder(layers: Layer[]): Layer[] {
  return [...layers].sort((a, b) => a.order - b.order);
}

export function moveLayer(order: string[], id: string, newIndex: number): string[] {
  const filtered = order.filter((l) => l !== id);
  const clampedIndex = Math.max(0, Math.min(newIndex, filtered.length));
  filtered.splice(clampedIndex, 0, id);
  return filtered;
}

export function getObjectsForLayer(
  objects: WhiteboardObject[],
  layerId: string
): WhiteboardObject[] {
  return objects.filter((o) => o.layerId === layerId).sort((a, b) => a.zIndex - b.zIndex);
}

export function getNextZIndex(objects: WhiteboardObject[]): number {
  if (objects.length === 0) return 0;
  return Math.max(...objects.map((o) => o.zIndex)) + 1;
}

export function reindexZOrder(objects: WhiteboardObject[]): Record<string, number> {
  const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
  const result: Record<string, number> = {};
  sorted.forEach((obj, idx) => {
    result[obj.id] = idx;
  });
  return result;
}

export function moveObjectUp(objects: WhiteboardObject[], id: string): Record<string, number> {
  const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
  const idx = sorted.findIndex((o) => o.id === id);
  if (idx === -1 || idx === sorted.length - 1) return {};
  const a = sorted[idx];
  const b = sorted[idx + 1];
  return { [a.id]: b.zIndex, [b.id]: a.zIndex };
}

export function moveObjectDown(objects: WhiteboardObject[], id: string): Record<string, number> {
  const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
  const idx = sorted.findIndex((o) => o.id === id);
  if (idx <= 0) return {};
  const a = sorted[idx];
  const b = sorted[idx - 1];
  return { [a.id]: b.zIndex, [b.id]: a.zIndex };
}
