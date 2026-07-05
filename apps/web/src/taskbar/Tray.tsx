import { Calendar } from "./Calendar";
import { LiveIndicator } from "./LiveIndicator";
import { NetworkStatus } from "./NetworkStatus";
import { NotificationCounter } from "./NotificationCounter";

export function Tray() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px" }}>
      <LiveIndicator />
      <NetworkStatus />
      <NotificationCounter />
      <Calendar />
    </div>
  );
}
