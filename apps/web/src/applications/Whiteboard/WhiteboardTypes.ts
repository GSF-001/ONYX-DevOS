// WhiteboardTypes.ts
// Core type definitions shared across the entire Whiteboard module.

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export type ObjectType =
  | "sticky"
  | "rectangle"
  | "ellipse"
  | "arrow"
  | "text"
  | "frame"
  | "image"
  | "icon"
  | "video";

export interface BaseObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layerId: string;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  opacity: number;
  createdAt: number;
  updatedAt: number;
}

export interface StickyNoteObject extends BaseObject {
  type: "sticky";
  text: string;
  color: string;
  fontSize: number;
}

export interface RectangleObject extends BaseObject {
  type: "rectangle";
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

export interface EllipseObject extends BaseObject {
  type: "ellipse";
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface ArrowObject extends BaseObject {
  type: "arrow";
  points: Point[];
  stroke: string;
  strokeWidth: number;
  startCap: "none" | "arrow" | "dot";
  endCap: "none" | "arrow" | "dot";
}

export interface TextObject extends BaseObject {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: "left" | "center" | "right";
  bold: boolean;
  italic: boolean;
}

export interface FrameObject extends BaseObject {
  type: "frame";
  name: string;
  fill: string;
  childIds: string[];
}

export interface ImageObject extends BaseObject {
  type: "image";
  src: string;
  alt: string;
}

export interface IconObject extends BaseObject {
  type: "icon";
  name: string;
  color: string;
}

export interface VideoObject extends BaseObject {
  type: "video";
  src: string;
  poster?: string;
  autoplay: boolean;
  loop: boolean;
}

export type WhiteboardObject =
  | StickyNoteObject
  | RectangleObject
  | EllipseObject
  | ArrowObject
  | TextObject
  | FrameObject
  | ImageObject
  | IconObject
  | VideoObject;

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  order: number;
  parentId: string | null;
  collapsed: boolean;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export interface SelectionState {
  selectedIds: string[];
  hoveredId: string | null;
  marqueeRect: Rect | null;
}

export interface GuideLineData {
  id: string;
  orientation: "horizontal" | "vertical";
  position: number;
  color?: string;
}

export interface SnapResult {
  x: number | null;
  y: number | null;
  guides: GuideLineData[];
}

export interface Command {
  id: string;
  label: string;
  do: () => void;
  undo: () => void;
  timestamp: number;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  objects: WhiteboardObject[];
  layers: Layer[];
}

export type ToolMode =
  | "select"
  | "pan"
  | "sticky"
  | "rectangle"
  | "ellipse"
  | "arrow"
  | "text"
  | "frame"
  | "image"
  | "icon"
  | "video";

export interface WhiteboardState {
  objects: Record<string, WhiteboardObject>;
  layers: Record<string, Layer>;
  layerOrder: string[];
  camera: Camera;
  selection: SelectionState;
  tool: ToolMode;
  guides: GuideLineData[];
  gridEnabled: boolean;
  gridSize: number;
  snapEnabled: boolean;
  rulersEnabled: boolean;
}

export function makeId(prefix = "obj"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}
