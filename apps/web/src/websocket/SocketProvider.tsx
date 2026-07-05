import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SocketContext, type SocketMessage, type SocketStatus } from "./SocketContext";
import { createReconnectController } from "./reconnect";
import { API_BASE_URL } from "../shared/api/client";

interface SocketProviderProps {
  children: ReactNode;
}

/**
 * Owns the single websocket connection to the server (pairs with
 * server/websocket). Every feature that needs live updates subscribes to a
 * room through this provider's context rather than opening its own socket.
 */
export function SocketProvider({ children }: SocketProviderProps) {
  const [status, setStatus] = useState<SocketStatus>("connecting");
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef(new Set<(message: SocketMessage) => void>());
  const pendingRoomsRef = useRef(new Set<string>());
  const reconnectRef = useRef(createReconnectController());

  const connect = useCallback(() => {
    const wsUrl = API_BASE_URL.replace(/^http/, "ws");
    const socket = new WebSocket(`${wsUrl}/ws`);
    socketRef.current = socket;
    setStatus("connecting");

    socket.onopen = () => {
      setStatus("connected");
      reconnectRef.current.reset();
      // Re-subscribe to any rooms that were requested while disconnected.
      for (const room of pendingRoomsRef.current) {
        socket.send(JSON.stringify({ action: "subscribe", room }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as SocketMessage;
        for (const listener of listenersRef.current) listener(message);
      } catch {
        // Ignore malformed frames rather than crashing the socket loop.
      }
    };

    socket.onclose = () => {
      setStatus("disconnected");
      reconnectRef.current.scheduleReconnect(connect);
    };

    socket.onerror = () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      reconnectRef.current.cancel();
      socketRef.current?.close();
    };
  }, [connect]);

  const subscribe = useCallback((room: string) => {
    pendingRoomsRef.current.add(room);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: "subscribe", room }));
    }
  }, []);

  const unsubscribe = useCallback((room: string) => {
    pendingRoomsRef.current.delete(room);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: "unsubscribe", room }));
    }
  }, []);

  const addListener = useCallback((listener: (message: SocketMessage) => void) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  return (
    <SocketContext.Provider value={{ status, subscribe, unsubscribe, addListener }}>
      {children}
    </SocketContext.Provider>
  );
}
