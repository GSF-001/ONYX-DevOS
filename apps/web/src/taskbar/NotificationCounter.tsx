import { useNotifications } from "../notifications/NotificationManager";

export function NotificationCounter() {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) {
    return <span style={{ fontSize: 14 }} aria-label="No notifications">🔔</span>;
  }

  return (
    <span style={{ position: "relative", fontSize: 14 }} aria-label={`${unreadCount} notifications`}>
      🔔
      <span
        style={{
          position: "absolute",
          top: -4,
          right: -6,
          background: "var(--win-danger)",
          color: "#fff",
          borderRadius: 999,
          fontSize: 9,
          padding: "1px 4px",
          fontFamily: "var(--win-font-mono)",
        }}
      >
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    </span>
  );
}
