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

interface PullRequestNotificationProps {
  number: number;
  action?: string;
}

export function PullRequestNotificationBody({ number, action }: PullRequestNotificationProps) {
  return (
    <span>
      PR #{number} {action ?? "updated"}
    </span>
  );
}
