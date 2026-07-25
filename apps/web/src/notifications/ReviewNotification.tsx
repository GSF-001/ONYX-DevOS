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

interface ReviewNotificationProps {
  reviewer: string;
  pullRequestNumber: number;
  state: string;
}

export function ReviewNotificationBody({ reviewer, pullRequestNumber, state }: ReviewNotificationProps) {
  return (
    <span>
      <strong>{reviewer}</strong> {state.replace(/_/g, " ")} PR #{pullRequestNumber}
    </span>
  );
}
