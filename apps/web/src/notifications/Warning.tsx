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
