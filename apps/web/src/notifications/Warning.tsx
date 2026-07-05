// notifications/Warning.tsx
import { useNotifications } from "./NotificationManager";
import { playWarning } from "../audio";

export function useWarningToast() {
  const { add } = useNotifications();
  return (title: string, body?: string) => {
    playWarning();
    return add({ tone: "warning", title, body, autoDismissMs: 6000 });
  };
}
