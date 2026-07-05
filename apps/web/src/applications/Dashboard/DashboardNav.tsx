import { useWindowManager } from "../../window-manager";
import { APP_ICONS } from "../../icons";
import { WINDOW_REGISTRY } from "../../window-manager";

const NAV_ORDER = [
  "dashboard",
  "repository",
  "pullRequests",
  "reviews",
  "issues",
  "team",
  "reports",
  "insights",
  "settings",
];

/**
 * Left-hand navigation list matching the mockup's Dashboard sidebar
 * (Dashboard/Repository/Pull Requests/.../Settings as a vertical menu,
 * not a repo picker). Clicking an item opens that app's window — "Dashboard"
 * itself is a no-op since we're already here.
 */
export function DashboardNav() {
  const manager = useWindowManager();

  return (
    <nav style={{ width: 150, borderRight: "1px solid var(--win-face-dark)", padding: 4 }}>
      {NAV_ORDER.map((appId) => {
        const def = WINDOW_REGISTRY[appId];
        const Icon = APP_ICONS[appId];
        if (!def) return null;
        return (
          <div
            key={appId}
            onClick={() => appId !== "dashboard" && manager.open(appId)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              fontSize: 12,
              borderRadius: 2,
              cursor: appId === "dashboard" ? "default" : "pointer",
              background: appId === "dashboard" ? "var(--win-titlebar-active)" : "transparent",
              color: appId === "dashboard" ? "var(--win-titlebar-text)" : "inherit",
            }}
          >
            <span style={{ width: 16, height: 16, display: "inline-flex" }}>
              {Icon && <Icon />}
            </span>
            {def.title}
          </div>
        );
      })}
    </nav>
  );
}
