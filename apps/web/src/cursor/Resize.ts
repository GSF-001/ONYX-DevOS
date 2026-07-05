// cursor/Resize.ts
import { setGlobalCursor } from "./CursorManager";
export const useResizeEwCursor = () => setGlobalCursor("resize-ew");
export const useResizeNsCursor = () => setGlobalCursor("resize-ns");
export const useResizeNwseCursor = () => setGlobalCursor("resize-nwse");
