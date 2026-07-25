/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// WhiteboardStore.ts
// Lightweight observable store (no external state library required).

import {
  WhiteboardState,
  WhiteboardObject,
  Layer,
  Camera,
  ToolMode,
  GuideLineData,
  makeId,
} from "./WhiteboardTypes";

type Listener = (state: WhiteboardState) => void;

function createInitialState(): WhiteboardState {
  const defaultLayerId = makeId("layer");
  const defaultLayer: Layer = {
    id: defaultLayerId,
    name: "Layer 1",
    visible: true,
    locked: false,
    order: 0,
    parentId: null,
    collapsed: false,
  };

  return {
    objects: {},
    layers: { [defaultLayerId]: defaultLayer },
    layerOrder: [defaultLayerId],
    camera: { x: 0, y: 0, zoom: 1 },
    selection: { selectedIds: [], hoveredId: null, marqueeRect: null },
    tool: "select",
    guides: [],
    gridEnabled: true,
    gridSize: 20,
    snapEnabled: true,
    rulersEnabled: true,
  };
}

export class WhiteboardStore {
  private state: WhiteboardState;
  private listeners: Set<Listener> = new Set();
  private defaultLayerId: string;

  constructor() {
    this.state = createInitialState();
    this.defaultLayerId = this.state.layerOrder[0];
  }

  getState(): WhiteboardState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((l) => l(this.state));
  }

  private set(partial: Partial<WhiteboardState>) {
    this.state = { ...this.state, ...partial };
    this.emit();
  }

  // ---------- Objects ----------
  addObject(obj: WhiteboardObject) {
    this.set({
      objects: { ...this.state.objects, [obj.id]: obj },
    });
  }

  updateObject(id: string, patch: Partial<WhiteboardObject>) {
    const existing = this.state.objects[id];
    if (!existing) return;
    const updated = { ...existing, ...patch, updatedAt: Date.now() } as WhiteboardObject;
    this.set({
      objects: { ...this.state.objects, [id]: updated },
    });
  }

  updateObjects(patches: Record<string, Partial<WhiteboardObject>>) {
    const objects = { ...this.state.objects };
    Object.entries(patches).forEach(([id, patch]) => {
      const existing = objects[id];
      if (existing) {
        objects[id] = { ...existing, ...patch, updatedAt: Date.now() } as WhiteboardObject;
      }
    });
    this.set({ objects });
  }

  removeObject(id: string) {
    const objects = { ...this.state.objects };
    delete objects[id];
    const selectedIds = this.state.selection.selectedIds.filter((s) => s !== id);
    this.set({
      objects,
      selection: { ...this.state.selection, selectedIds },
    });
  }

  removeObjects(ids: string[]) {
    const idSet = new Set(ids);
    const objects: Record<string, WhiteboardObject> = {};
    Object.values(this.state.objects).forEach((o) => {
      if (!idSet.has(o.id)) objects[o.id] = o;
    });
    const selectedIds = this.state.selection.selectedIds.filter((s) => !idSet.has(s));
    this.set({ objects, selection: { ...this.state.selection, selectedIds } });
  }

  getObject(id: string): WhiteboardObject | undefined {
    return this.state.objects[id];
  }

  getAllObjects(): WhiteboardObject[] {
    return Object.values(this.state.objects).sort((a, b) => a.zIndex - b.zIndex);
  }

  bringToFront(id: string) {
    const maxZ = Math.max(0, ...this.getAllObjects().map((o) => o.zIndex));
    this.updateObject(id, { zIndex: maxZ + 1 });
  }

  sendToBack(id: string) {
    const minZ = Math.min(0, ...this.getAllObjects().map((o) => o.zIndex));
    this.updateObject(id, { zIndex: minZ - 1 });
  }

  // ---------- Layers ----------
  addLayer(name = "New Layer"): Layer {
    const layer: Layer = {
      id: makeId("layer"),
      name,
      visible: true,
      locked: false,
      order: this.state.layerOrder.length,
      parentId: null,
      collapsed: false,
    };
    this.set({
      layers: { ...this.state.layers, [layer.id]: layer },
      layerOrder: [...this.state.layerOrder, layer.id],
    });
    return layer;
  }

  removeLayer(id: string) {
    if (this.state.layerOrder.length <= 1) return;
    const layers = { ...this.state.layers };
    delete layers[id];
    const layerOrder = this.state.layerOrder.filter((l) => l !== id);
    const fallbackId = layerOrder[0];
    const objects = { ...this.state.objects };
    Object.values(objects).forEach((o) => {
      if (o.layerId === id) objects[o.id] = { ...o, layerId: fallbackId };
    });
    this.set({ layers, layerOrder, objects });
  }

  updateLayer(id: string, patch: Partial<Layer>) {
    const existing = this.state.layers[id];
    if (!existing) return;
    this.set({
      layers: { ...this.state.layers, [id]: { ...existing, ...patch } },
    });
  }

  reorderLayer(id: string, newIndex: number) {
    const order = this.state.layerOrder.filter((l) => l !== id);
    order.splice(newIndex, 0, id);
    this.set({ layerOrder: order });
  }

  getDefaultLayerId(): string {
    return this.state.layerOrder[0] ?? this.defaultLayerId;
  }

  // ---------- Camera ----------
  setCamera(camera: Partial<Camera>) {
    this.set({ camera: { ...this.state.camera, ...camera } });
  }

  panBy(dx: number, dy: number) {
    this.set({
      camera: {
        ...this.state.camera,
        x: this.state.camera.x + dx,
        y: this.state.camera.y + dy,
      },
    });
  }

  zoomTo(zoom: number, anchor?: { x: number; y: number }) {
    const clamped = Math.min(8, Math.max(0.05, zoom));
    if (!anchor) {
      this.set({ camera: { ...this.state.camera, zoom: clamped } });
      return;
    }
    const cam = this.state.camera;
    const worldX = (anchor.x - cam.x) / cam.zoom;
    const worldY = (anchor.y - cam.y) / cam.zoom;
    const newX = anchor.x - worldX * clamped;
    const newY = anchor.y - worldY * clamped;
    this.set({ camera: { x: newX, y: newY, zoom: clamped } });
  }

  // ---------- Selection ----------
  selectObjects(ids: string[]) {
    this.set({ selection: { ...this.state.selection, selectedIds: ids } });
  }

  toggleSelect(id: string) {
    const { selectedIds } = this.state.selection;
    const next = selectedIds.includes(id)
      ? selectedIds.filter((s) => s !== id)
      : [...selectedIds, id];
    this.set({ selection: { ...this.state.selection, selectedIds: next } });
  }

  clearSelection() {
    this.set({ selection: { ...this.state.selection, selectedIds: [] } });
  }

  setHovered(id: string | null) {
    this.set({ selection: { ...this.state.selection, hoveredId: id } });
  }

  setMarquee(rect: WhiteboardState["selection"]["marqueeRect"]) {
    this.set({ selection: { ...this.state.selection, marqueeRect: rect } });
  }

  // ---------- Tool ----------
  setTool(tool: ToolMode) {
    this.set({ tool });
  }

  // ---------- Guides ----------
  setGuides(guides: GuideLineData[]) {
    this.set({ guides });
  }

  addGuide(guide: GuideLineData) {
    this.set({ guides: [...this.state.guides, guide] });
  }

  removeGuide(id: string) {
    this.set({ guides: this.state.guides.filter((g) => g.id !== id) });
  }

  // ---------- Settings ----------
  toggleGrid() {
    this.set({ gridEnabled: !this.state.gridEnabled });
  }

  setGridSize(size: number) {
    this.set({ gridSize: size });
  }

  toggleSnap() {
    this.set({ snapEnabled: !this.state.snapEnabled });
  }

  toggleRulers() {
    this.set({ rulersEnabled: !this.state.rulersEnabled });
  }

  // ---------- Bulk / Import-Export ----------
  replaceAll(state: Partial<WhiteboardState>) {
    this.set(state);
  }

  reset() {
    this.state = createInitialState();
    this.emit();
  }
}

export const whiteboardStore = new WhiteboardStore();
