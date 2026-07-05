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
