// Layers/LayerLock.ts

import { Layer, WhiteboardObject } from "../WhiteboardTypes";

export function isObjectEffectivelyLocked(
  obj: WhiteboardObject,
  layers: Record<string, Layer>
): boolean {
  if (obj.locked) return true;
  const layer = layers[obj.layerId];
  return layer ? layer.locked : false;
}

export function toggleLayerLock(layer: Layer): Layer {
  return { ...layer, locked: !layer.locked };
}

export function lockAllLayers(
  layers: Record<string, Layer>,
  locked: boolean
): Record<string, Layer> {
  const result: Record<string, Layer> = {};
  Object.entries(layers).forEach(([id, layer]) => {
    result[id] = { ...layer, locked };
  });
  return result;
}

export function filterUnlockedObjects(
  objects: WhiteboardObject[],
  layers: Record<string, Layer>
): WhiteboardObject[] {
  return objects.filter((o) => !isObjectEffectivelyLocked(o, layers));
}

export function canEditObject(
  obj: WhiteboardObject,
  layers: Record<string, Layer>
): boolean {
  return !isObjectEffectivelyLocked(obj, layers);
}
