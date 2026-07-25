/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

// notifications/Success.tsx
import { useNotifications } from "./NotificationManager";
import { playSuccess } from "../audio";

export function useSuccessToast() {
  const { add } = useNotifications();
  return (title: string, body?: string) => {
    playSuccess();
    return add({ tone: "success", title, body, autoDismissMs: 4000 });
  };
}
