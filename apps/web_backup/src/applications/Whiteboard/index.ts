// index.ts
// Public entry point for the Whiteboard module.

export * from "./WhiteboardTypes";
export { WhiteboardStore, whiteboardStore } from "./WhiteboardStore";
export { WhiteboardAPI, createWhiteboardAPI } from "./WhiteboardAPI";
export {
  useWhiteboardStore,
  useObjects,
  useSelection,
  useCamera,
  useLayers,
  useTool,
  useWhiteboardAPI,
  useUndoRedo,
  useKeyboardShortcuts,
  useCanvasEvents,
  useActiveLayer,
} from "./WhiteboardHooks";

export { WhiteboardApp } from "./WhiteboardApp";
export { WhiteboardWindow } from "./WhiteboardWindow";

// Canvas
export { InfiniteCanvas } from "./Canvas/InfiniteCanvas";
export { Grid } from "./Canvas/Grid";
export { Background } from "./Canvas/Background";
export { Zoom } from "./Canvas/Zoom";
export { useCameraControls, screenToWorld, worldToScreen, getCameraTransform } from "./Canvas/Camera";

// Layers
export { LayerPanel } from "./Layers/LayerPanel";
export { LayerItem } from "./Layers/LayerItem";
export { LayerGroup } from "./Layers/LayerGroup";
export * from "./Layers/LayerOrder";
export * from "./Layers/LayerVisibility";
export * from "./Layers/LayerLock";

// Objects
export { StickyNote } from "./Objects/StickyNote";
export { Rectangle } from "./Objects/Rectangle";
export { Ellipse } from "./Objects/Ellipse";
export { Arrow } from "./Objects/Arrow";
export { Text } from "./Objects/Text";
export { Frame } from "./Objects/Frame";
export { Image } from "./Objects/Image";
export { Icon } from "./Objects/Icon";
export { Video } from "./Objects/Video";

// Selection
export * from "./Selection/Marquee";
export * from "./Selection/MultiSelect";
export * from "./Selection/HitTest";
export { HoverController, getHoverCursor } from "./Selection/Hover";
export { SelectionBox, MarqueeBox } from "./Selection/SelectionBox";
export { SelectionHandles } from "./Selection/SelectionHandles";

// History
export { UndoRedoManager } from "./History/UndoRedo";
export { CommandStack } from "./History/CommandStack";
export { SnapshotManager, createSnapshot, restoreSnapshot } from "./History/Snapshot";

// Collisions
export * from "./Collisions/CollisionDetection";
export * from "./Collisions/BoundingBox";
export * from "./Collisions/Overlap";

// Snapping
export * from "./Snapping/SnapToGrid";
export * from "./Snapping/SnapToObject";
export * from "./Snapping/SmartGuides";
export * from "./Snapping/SnapThreshold";

// Rulers
export { HorizontalRuler } from "./Rulers/HorizontalRuler";
export { VerticalRuler } from "./Rulers/VerticalRuler";
export { RulerMarker } from "./Rulers/RulerMarker";

// Guides
export { GuideLine } from "./Guides/GuideLine";
export { GuideManager, guideManager } from "./Guides/GuideManager";
export * from "./Guides/AlignmentGuide";

// Templates
export { TemplateGallery } from "./Templates/TemplateGallery";
export { TemplateItem } from "./Templates/TemplateItem";
export * from "./Templates/TemplateLoader";
export * from "./Templates/TemplateCategories";

// Widgets
export { ColorSwatch, DEFAULT_PALETTE } from "./Widgets/ColorSwatch";
export { ObjectThumbnail } from "./Widgets/ObjectThumbnail";
