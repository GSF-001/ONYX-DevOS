/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Selection/MultiSelect.ts

export function addToSelection(current: string[], id: string): string[] {
  if (current.includes(id)) return current;
  return [...current, id];
}

export function removeFromSelection(current: string[], id: string): string[] {
  return current.filter((s) => s !== id);
}

export function toggleInSelection(current: string[], id: string): string[] {
  return current.includes(id) ? removeFromSelection(current, id) : addToSelection(current, id);
}

export function selectRange(
  orderedIds: string[],
  fromId: string,
  toId: string
): string[] {
  const fromIdx = orderedIds.indexOf(fromId);
  const toIdx = orderedIds.indexOf(toId);
  if (fromIdx === -1 || toIdx === -1) return [toId];
  const [start, end] = fromIdx < toIdx ? [fromIdx, toIdx] : [toIdx, fromIdx];
  return orderedIds.slice(start, end + 1);
}

export function isMultiSelect(selectedIds: string[]): boolean {
  return selectedIds.length > 1;
}

export interface SelectModifiers {
  shiftKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
}

export function resolveSelectionClick(
  current: string[],
  clickedId: string,
  modifiers: SelectModifiers,
  orderedIds: string[],
  lastClickedId: string | null
): string[] {
  if (modifiers.shiftKey && lastClickedId) {
    return selectRange(orderedIds, lastClickedId, clickedId);
  }
  if (modifiers.metaKey || modifiers.ctrlKey) {
    return toggleInSelection(current, clickedId);
  }
  return [clickedId];
}
