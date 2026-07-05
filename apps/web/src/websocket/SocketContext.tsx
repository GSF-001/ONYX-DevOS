import { createContext, useContext } from "react";

export type SocketStatus = "connecting" | "connected" | "disconnected";

export interface SocketMessage {
  type: string;
  [key: string]: unknown;
}

export interface SocketContextValue {
  status: SocketStatus;
  subscribe: (room: string) => void;
  unsubscribe: (room: string) => void;
  /** Registers a listener for every incoming message; returns an unsubscribe fn. */
  addListener: (listener: (message: SocketMessage) => void) => () => void;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocketContext(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocketContext must be used within a <SocketProvider>");
  }
  return ctx;
}
