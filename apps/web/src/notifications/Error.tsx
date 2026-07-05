// notifications/Error.tsx
import { useNotifications } from "./NotificationManager";
import { playError } from "../audio";

export function useErrorToast() {
  const { add } = useNotifications();
  return (title: string, body?: string) => {
    playError();
    return add({ tone: "error", title, body }); // no auto-dismiss — errors should be read
  };
}
