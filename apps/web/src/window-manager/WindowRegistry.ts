import { lazy, type LazyExoticComponent } from "react";
import { TOKENS } from "../theme";

export interface WindowAppDefinition {
  id: string;
  title: string;
  icon: string; // path or inline data URI, resolved by DesktopIcon
  defaultWidth: number;
  defaultHeight: number;
  component: LazyExoticComponent<() => JSX.Element>;
}

/**
 * Maps an appId to the component rendered inside its window. App
 * components themselves live under `../apps/<id>` — not part of this
 * batch, so they're lazy-imported by convention; adding a new app means
 * adding one entry here plus the matching file at that path.
 */
export const WINDOW_REGISTRY: Record<string, WindowAppDefinition> = {
  dashboard: {
    id: "dashboard",
    title: "Dashboard",
    icon: "dashboard",
    defaultWidth: 760,
    defaultHeight: 520,
    component: lazy(() => import("../apps/Dashboard")),
  },
  repository: {
    id: "repository",
    title: "Repository",
    icon: "repository",
    defaultWidth: 640,
    defaultHeight: 460,
    component: lazy(() => import("../apps/Repository")),
  },
  pullRequests: {
    id: "pullRequests",
    title: "Pull Requests",
    icon: "pullRequests",
    defaultWidth: 720,
    defaultHeight: 480,
    component: lazy(() => import("../apps/PullRequests")),
  },
  reviews: {
    id: "reviews",
    title: "Reviews",
    icon: "reviews",
    defaultWidth: 680,
    defaultHeight: 460,
    component: lazy(() => import("../apps/Reviews")),
  },
  issues: {
    id: "issues",
    title: "Issues",
    icon: "issues",
    defaultWidth: 640,
    defaultHeight: 440,
    component: lazy(() => import("../apps/Issues")),
  },
  insights: {
    id: "insights",
    title: "Insights",
    icon: "insights",
    defaultWidth: 720,
    defaultHeight: 520,
    component: lazy(() => import("../apps/Insights")),
  },
  team: {
    id: "team",
    title: "Team",
    icon: "team",
    defaultWidth: 680,
    defaultHeight: 460,
    component: lazy(() => import("../apps/Team")),
  },
  reports: {
    id: "reports",
    title: "Reports",
    icon: "reports",
    defaultWidth: 560,
    defaultHeight: 420,
    component: lazy(() => import("../apps/Reports")),
  },
  heatmap: {
    id: "heatmap",
    title: "Heatmap",
    icon: "heatmap",
    defaultWidth: 720,
    defaultHeight: 420,
    component: lazy(() => import("../apps/Heatmap")),
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: "terminal",
    defaultWidth: 600,
    defaultHeight: 380,
    component: lazy(() => import("../apps/Terminal")),
  },
  settings: {
    id: "settings",
    title: "Settings",
    icon: "settings",
    defaultWidth: 600,
    defaultHeight: 440,
    component: lazy(() => import("../apps/Settings")),
  },
};

export function getWindowDefaults(appId: string) {
  const def = WINDOW_REGISTRY[appId];
  return {
    width: def?.defaultWidth ?? TOKENS.window.defaultWidth,
    height: def?.defaultHeight ?? TOKENS.window.defaultHeight,
  };
}
