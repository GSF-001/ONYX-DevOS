import { useEffect } from "react";
import { useSocketContext, type SocketMessage } from "./SocketContext";

/**
 * Subscribes to messages of a specific `type` for the lifetime of the
 * component. This is the primitive every feature (Dashboard, Activity,
 * notifications) builds on instead of touching the raw socket.
 */
export function useSocketEvent<T extends SocketMessage = SocketMessage>(
  type: string,
  handler: (message: T) => void
): void {
  const { addListener } = useSocketContext();

  useEffect(() => {
    return addListener((message) => {
      if (message.type === type) handler(message as T);
    });
  }, [type, handler, addListener]);
}
