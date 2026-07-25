// WhiteboardHooks.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WhiteboardStore } from "./WhiteboardStore";
import { WhiteboardState, WhiteboardObject, Camera, Layer, ToolMode } from "./WhiteboardTypes";
import { UndoRedoManager } from "./History/UndoRedo";
import { createWhiteboardAPI, WhiteboardAPI } from "./WhiteboardAPI";

export function useWhiteboardStore<T>(
  store: WhiteboardStore,
  selector: (state: WhiteboardState) => T
): T {
  const [selected, setSelected] = useState(() => selector(store.getState()));
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  useEffect(() => {
    return store.subscribe((state) => {
      setSelected(selectorRef.current(state));
    });
  }, [store]);

  return selected;
}

export function useObjects(store: WhiteboardStore): WhiteboardObject[] {
  return useWhiteboardStore(store, (s) =>
    Object.values(s.objects).sort((a, b) => a.zIndex - b.zIndex)
  );
}

export function useSelection(store: WhiteboardStore) {
  const selection = useWhiteboardStore(store, (s) => s.selection);
  const select = useCallback((ids: string[]) => store.selectObjects(ids), [store]);
  const clear = useCallback(() => store.clearSelection(), [store]);
  const toggle = useCallback((id: string) => store.toggleSelect(id), [store]);
  return { ...selection, select, clear, toggle };
}

export function useCamera(store: WhiteboardStore) {
  const camera = useWhiteboardStore(store, (s) => s.camera);
  const setCamera = useCallback((patch: Partial<Camera>) => store.setCamera(patch), [store]);
  return [camera, setCamera] as const;
}

export function useLayers(store: WhiteboardStore) {
  const layers = useWhiteboardStore(store, (s) => s.layers);
  const layerOrder = useWhiteboardStore(store, (s) => s.layerOrder);
  return { layers, layerOrder };
}

export function useTool(store: WhiteboardStore) {
  const tool = useWhiteboardStore(store, (s) => s.tool);
  const setTool = useCallback((t: ToolMode) => store.setTool(t), [store]);
  return [tool, setTool] as const;
}

export function useWhiteboardAPI(store: WhiteboardStore): WhiteboardAPI {
  return useMemo(() => createWhiteboardAPI(store), [store]);
}

export function useUndoRedo(store: WhiteboardStore) {
  const managerRef = useRef<UndoRedoManager | null>(null);
  if (!managerRef.current) {
    managerRef.current = new UndoRedoManager(store);
  }
  const [, forceRerender] = useState(0);

  const undo = useCallback(() => {
    managerRef.current?.undo();
    forceRerender((n) => n + 1);
  }, []);

  const redo = useCallback(() => {
    managerRef.current?.redo();
    forceRerender((n) => n + 1);
  }, []);

  return {
    manager: managerRef.current,
    undo,
    redo,
    canUndo: managerRef.current.canUndo(),
    canRedo: managerRef.current.canRedo(),
  };
}

interface KeyboardShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSelectAll?: () => void;
  onEscape?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA"].includes(target.tagName);
      if (isTyping) return;

      if (isMeta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handlersRef.current.onUndo?.();
      } else if (isMeta && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) {
        e.preventDefault();
        handlersRef.current.onRedo?.();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        handlersRef.current.onDelete?.();
      } else if (isMeta && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handlersRef.current.onDuplicate?.();
      } else if (isMeta && e.key.toLowerCase() === "a") {
        e.preventDefault();
        handlersRef.current.onSelectAll?.();
      } else if (e.key === "Escape") {
        handlersRef.current.onEscape?.();
      } else if (isMeta && e.key.toLowerCase() === "c") {
        handlersRef.current.onCopy?.();
      } else if (isMeta && e.key.toLowerCase() === "v") {
        handlersRef.current.onPaste?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

export function useCanvasEvents(
  onPan: (dx: number, dy: number) => void,
  onZoom: (delta: number, point: { x: number; y: number }) => void
) {
  const handleWheel = useCallback(
    (e: React.WheelEvent, containerRect: DOMRect) => {
      const point = { x: e.clientX - containerRect.left, y: e.clientY - containerRect.top };
      if (e.ctrlKey || e.metaKey) {
        onZoom(-e.deltaY * 0.01, point);
      } else {
        onPan(-e.deltaX, -e.deltaY);
      }
    },
    [onPan, onZoom]
  );

  return { handleWheel };
}

export function useActiveLayer(store: WhiteboardStore) {
  const layerOrder = useWhiteboardStore(store, (s) => s.layerOrder);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(layerOrder[0] ?? null);

  useEffect(() => {
    if (!activeLayerId && layerOrder.length > 0) {
      setActiveLayerId(layerOrder[0]);
    }
  }, [activeLayerId, layerOrder]);

  return [activeLayerId, setActiveLayerId] as const;
}
