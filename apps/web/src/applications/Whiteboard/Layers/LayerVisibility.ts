/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Layers/LayerVisibility.ts

import { Layer, WhiteboardObject } from "../WhiteboardTypes";

export function isObjectEffectivelyVisible(
  obj: WhiteboardObject,
  layers: Record<string, Layer>
): boolean {
  if (!obj.visible) return false;
  const layer = layers[obj.layerId];
  if (!layer) return true;
  return layer.visible;
}

export function toggleLayerVisibility(layer: Layer): Layer {
  return { ...layer, visible: !layer.visible };
}

export function setAllLayersVisibility(
  layers: Record<string, Layer>,
  visible: boolean
): Record<string, Layer> {
  const result: Record<string, Layer> = {};
  Object.entries(layers).forEach(([id, layer]) => {
    result[id] = { ...layer, visible };
  });
  return result;
}

export function getVisibleObjects(
  objects: WhiteboardObject[],
  layers: Record<string, Layer>
): WhiteboardObject[] {
  return objects.filter((o) => isObjectEffectivelyVisible(o, layers));
}

export function isolateLayer(
  layers: Record<string, Layer>,
  isolateId: string
): Record<string, Layer> {
  const result: Record<string, Layer> = {};
  Object.entries(layers).forEach(([id, layer]) => {
    result[id] = { ...layer, visible: id === isolateId };
  });
  return result;
}
