/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

interface MergeNotificationProps {
  number: number;
  title: string;
}

export function MergeNotificationBody({ number, title }: MergeNotificationProps) {
  return (
    <span>
      #{number} “{title}” merged
    </span>
  );
}
