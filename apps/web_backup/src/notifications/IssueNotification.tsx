/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

interface IssueNotificationProps {
  number: number;
  title: string;
  state: string;
}

export function IssueNotificationBody({ number, title, state }: IssueNotificationProps) {
  return (
    <span>
      Issue #{number} “{title}” {state}
    </span>
  );
}
