// WhiteboardAPI.ts
// High-level, ergonomic API that wraps the WhiteboardStore for consumers.

import { WhiteboardStore } from "./WhiteboardStore";
import {
  ArrowObject,
  EllipseObject,
  FrameObject,
  IconObject,
  ImageObject,
  RectangleObject,
  StickyNoteObject,
  TextObject,
  VideoObject,
  WhiteboardObject,
  WhiteboardState,
  makeId,
} from "./WhiteboardTypes";
import { getNextZIndex } from "./Layers/LayerOrder";
import { alignObjects, distributeObjects, AlignmentType } from "./Guides/AlignmentGuide";
import { unionBounds } from "./Collisions/BoundingBox";

function baseFields(store: WhiteboardStore, width: number, height: number, x: number, y: number) {
  const now = Date.now();
  return {
    x,
    y,
    width,
    height,
    rotation: 0,
    layerId: store.getDefaultLayerId(),
    zIndex: getNextZIndex(store.getAllObjects()),
    locked: false,
    visible: true,
    opacity: 1,
    createdAt: now,
    updatedAt: now,
  };
}

export class WhiteboardAPI {
  private store: WhiteboardStore;

  constructor(store: WhiteboardStore) {
    this.store = store;
  }

  // ---------- Object creation ----------
  createStickyNote(x: number, y: number, text = "", color = "#fff3b0"): StickyNoteObject {
    const obj: StickyNoteObject = {
      id: makeId("sticky"),
      type: "sticky",
      ...baseFields(this.store, 180, 140, x, y),
      text,
      color,
      fontSize: 14,
    };
    this.store.addObject(obj);
    return obj;
  }

  createRectangle(x: number, y: number, width = 160, height = 100): RectangleObject {
    const obj: RectangleObject = {
      id: makeId("rect"),
      type: "rectangle",
      ...baseFields(this.store, width, height, x, y),
      fill: "#a5d8ff",
      stroke: "#1c1f26",
      strokeWidth: 2,
      cornerRadius: 4,
    };
    this.store.addObject(obj);
    return obj;
  }

  createEllipse(x: number, y: number, width = 140, height = 140): EllipseObject {
    const obj: EllipseObject = {
      id: makeId("ellipse"),
      type: "ellipse",
      ...baseFields(this.store, width, height, x, y),
      fill: "#b2f2bb",
      stroke: "#1c1f26",
      strokeWidth: 2,
    };
    this.store.addObject(obj);
    return obj;
  }

  createArrow(x1: number, y1: number, x2: number, y2: number): ArrowObject {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const obj: ArrowObject = {
      id: makeId("arrow"),
      type: "arrow",
      ...baseFields(this.store, Math.abs(x2 - x1) || 1, Math.abs(y2 - y1) || 1, minX, minY),
      points: [
        { x: x1 - minX, y: y1 - minY },
        { x: x2 - minX, y: y2 - minY },
      ],
      stroke: "#1c1f26",
      strokeWidth: 2,
      startCap: "none",
      endCap: "arrow",
    };
    this.store.addObject(obj);
    return obj;
  }

  createText(x: number, y: number, text = "Text"): TextObject {
    const obj: TextObject = {
      id: makeId("text"),
      type: "text",
      ...baseFields(this.store, 200, 32, x, y),
      text,
      fontSize: 18,
      fontFamily: "Inter, sans-serif",
      color: "#1c1f26",
      align: "left",
      bold: false,
      italic: false,
    };
    this.store.addObject(obj);
    return obj;
  }

  createFrame(x: number, y: number, width = 400, height = 300, name = "Frame"): FrameObject {
    const obj: FrameObject = {
      id: makeId("frame"),
      type: "frame",
      ...baseFields(this.store, width, height, x, y),
      name,
      fill: "#fbfbfc",
      childIds: [],
    };
    this.store.addObject(obj);
    return obj;
  }

  createImage(x: number, y: number, src: string, width = 240, height = 160, alt = ""): ImageObject {
    const obj: ImageObject = {
      id: makeId("image"),
      type: "image",
      ...baseFields(this.store, width, height, x, y),
      src,
      alt,
    };
    this.store.addObject(obj);
    return obj;
  }

  createIcon(x: number, y: number, name = "star", color = "#1c1f26"): IconObject {
    const obj: IconObject = {
      id: makeId("icon"),
      type: "icon",
      ...baseFields(this.store, 40, 40, x, y),
      name,
      color,
    };
    this.store.addObject(obj);
    return obj;
  }

  createVideo(x: number, y: number, src: string, width = 320, height = 180): VideoObject {
    const obj: VideoObject = {
      id: makeId("video"),
      type: "video",
      ...baseFields(this.store, width, height, x, y),
      src,
      autoplay: false,
      loop: false,
    };
    this.store.addObject(obj);
    return obj;
  }

  // ---------- Manipulation ----------
  duplicateObjects(ids: string[], offset = { x: 20, y: 20 }): WhiteboardObject[] {
    const duplicates: WhiteboardObject[] = [];
    ids.forEach((id) => {
      const original = this.store.getObject(id);
      if (!original) return;
      const clone: WhiteboardObject = {
        ...original,
        id: makeId(original.type),
        x: original.x + offset.x,
        y: original.y + offset.y,
        zIndex: getNextZIndex(this.store.getAllObjects()),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.store.addObject(clone);
      duplicates.push(clone);
    });
    return duplicates;
  }

  deleteObjects(ids: string[]) {
    this.store.removeObjects(ids);
  }

  alignSelection(ids: string[], type: AlignmentType) {
    const objects = ids.map((id) => this.store.getObject(id)).filter(Boolean) as WhiteboardObject[];
    const patches = alignObjects(objects, type);
    this.store.updateObjects(patches);
  }

  distributeSelection(ids: string[], axis: "horizontal" | "vertical") {
    const objects = ids.map((id) => this.store.getObject(id)).filter(Boolean) as WhiteboardObject[];
    const patches = distributeObjects(objects, axis);
    this.store.updateObjects(patches);
  }

  getSelectionBounds(ids: string[]) {
    const objects = ids.map((id) => this.store.getObject(id)).filter(Boolean) as WhiteboardObject[];
    return unionBounds(objects.map((o) => ({ x: o.x, y: o.y, width: o.width, height: o.height })));
  }

  groupIntoFrame(ids: string[], name = "Group"): FrameObject | null {
    const objects = ids.map((id) => this.store.getObject(id)).filter(Boolean) as WhiteboardObject[];
    const bounds = this.getSelectionBounds(ids);
    if (!bounds) return null;
    const padding = 24;
    const frame = this.createFrame(
      bounds.x - padding,
      bounds.y - padding,
      bounds.width + padding * 2,
      bounds.height + padding * 2,
      name
    );
    this.store.updateObject(frame.id, { childIds: objects.map((o) => o.id) });
    return frame;
  }

  // ---------- Import / Export ----------
  exportToJSON(): string {
    return JSON.stringify(this.store.getState(), null, 2);
  }

  importFromJSON(json: string) {
    try {
      const parsed = JSON.parse(json) as WhiteboardState;
      this.store.replaceAll(parsed);
    } catch (err) {
      throw new Error("Invalid whiteboard JSON payload");
    }
  }

  exportSelectionToJSON(ids: string[]): string {
    const objects = ids.map((id) => this.store.getObject(id)).filter(Boolean);
    return JSON.stringify(objects, null, 2);
  }

  importObjectsFromJSON(json: string, offset = { x: 40, y: 40 }): WhiteboardObject[] {
    try {
      const parsed = JSON.parse(json) as WhiteboardObject[];
      const created: WhiteboardObject[] = [];
      parsed.forEach((raw) => {
        const clone: WhiteboardObject = {
          ...raw,
          id: makeId(raw.type),
          x: raw.x + offset.x,
          y: raw.y + offset.y,
          layerId: this.store.getDefaultLayerId(),
          zIndex: getNextZIndex(this.store.getAllObjects()),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        this.store.addObject(clone);
        created.push(clone);
      });
      return created;
    } catch {
      throw new Error("Invalid objects JSON payload");
    }
  }
}

export function createWhiteboardAPI(store: WhiteboardStore): WhiteboardAPI {
  return new WhiteboardAPI(store);
}
