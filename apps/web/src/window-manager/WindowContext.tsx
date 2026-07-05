import { createContext, useContext, useReducer, type ReactNode } from "react";
import { nextZIndex } from "./ZIndex";
import { getWindowDefaults } from "./WindowRegistry";
import { TOKENS } from "../theme";

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInstance extends WindowBounds {
  id: string;
  appId: string;
  title: string;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prevBounds: WindowBounds | null;
}

interface WindowState {
  windows: WindowInstance[];
  focusedId: string | null;
}

type WindowAction =
  | { type: "OPEN"; id: string; appId: string; title: string; bounds?: Partial<WindowBounds> }
  | { type: "CLOSE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "MAXIMIZE"; id: string }
  | { type: "RESTORE"; id: string }
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; width: number; height: number }
  | { type: "REPLACE_ALL"; windows: WindowInstance[] };

function reducer(state: WindowState, action: WindowAction): WindowState {
  switch (action.type) {
    case "OPEN": {
      const existing = state.windows.find((w) => w.id === action.id);
      if (existing) {
        return {
          windows: state.windows.map((w) =>
            w.id === action.id ? { ...w, minimized: false, zIndex: nextZIndex() } : w
          ),
          focusedId: action.id,
        };
      }

      const defaults = getWindowDefaults(action.appId);
      const offset = state.windows.length * 24;

      const instance: WindowInstance = {
        id: action.id,
        appId: action.appId,
        title: action.title,
        x: action.bounds?.x ?? 80 + offset,
        y: action.bounds?.y ?? 60 + offset,
        width: action.bounds?.width ?? defaults.width,
        height: action.bounds?.height ?? defaults.height,
        zIndex: nextZIndex(),
        minimized: false,
        maximized: false,
        prevBounds: null,
      };

      return { windows: [...state.windows, instance], focusedId: instance.id };
    }

    case "CLOSE": {
      const windows = state.windows.filter((w) => w.id !== action.id);
      const focusedId = state.focusedId === action.id ? windows.at(-1)?.id ?? null : state.focusedId;
      return { windows, focusedId };
    }

    case "FOCUS": {
      return {
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, zIndex: nextZIndex() } : w)),
        focusedId: action.id,
      };
    }

    case "MINIMIZE": {
      return {
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, minimized: true } : w)),
        focusedId: state.focusedId === action.id ? null : state.focusedId,
      };
    }

    case "MAXIMIZE": {
      return {
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          return {
            ...w,
            maximized: true,
            minimized: false,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - TOKENS.desktop.taskbarHeight,
            zIndex: nextZIndex(),
          };
        }),
        focusedId: action.id,
      };
    }

    case "RESTORE": {
      return {
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          if (!w.maximized || !w.prevBounds) return { ...w, minimized: false };
          return { ...w, maximized: false, minimized: false, ...w.prevBounds, prevBounds: null };
        }),
        focusedId: action.id,
      };
    }

    case "MOVE": {
      return {
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, x: action.x, y: action.y } : w)),
        focusedId: state.focusedId,
      };
    }

    case "RESIZE": {
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, width: action.width, height: action.height } : w
        ),
        focusedId: state.focusedId,
      };
    }

    case "REPLACE_ALL": {
      return { windows: action.windows, focusedId: action.windows.at(-1)?.id ?? null };
    }

    default:
      return state;
  }
}

interface WindowContextValue {
  state: WindowState;
  dispatch: React.Dispatch<WindowAction>;
}

const WindowContext = createContext<WindowContextValue | null>(null);

export function WindowContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], focusedId: null });
  return <WindowContext.Provider value={{ state, dispatch }}>{children}</WindowContext.Provider>;
}

export function useWindowContext(): WindowContextValue {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindowContext must be used within a <WindowContextProvider>");
  return ctx;
}

export type { WindowAction, WindowState };
