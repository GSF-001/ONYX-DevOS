export interface Command {
  id: string;
  label: string;
  hint?: string;
  keywords?: string[];
  group: "Navigate" | "Actions" | "System";
  run: () => void;
}

export interface CommandContext {
  openApp: (appId: string) => void;
  navigate: (path: string) => void;
  currentRepoFullName?: string;
  currentRepoUrl?: string;
  onExportReport?: (format: "csv" | "json") => void;
  onCopyLink?: () => void;
}

const APP_NAV_ITEMS: { appId: string; label: string; keywords: string[] }[] = [
  { appId: "dashboard", label: "Open Dashboard", keywords: ["home", "overview"] },
  { appId: "repository", label: "Open Repository", keywords: ["repo", "code"] },
  { appId: "pullRequests", label: "Open Pull Requests", keywords: ["pr", "prs"] },
  { appId: "reviews", label: "Open Reviews", keywords: ["review", "queue"] },
  { appId: "issues", label: "Open Issues", keywords: ["bug", "issue"] },
  { appId: "insights", label: "Open Insights", keywords: ["risk", "score", "bus factor"] },
  { appId: "team", label: "Open Team", keywords: ["people", "workload"] },
  { appId: "reports", label: "Open Reports", keywords: ["export", "pdf", "csv"] },
  { appId: "heatmap", label: "Open Heatmap", keywords: ["calendar", "activity"] },
  { appId: "terminal", label: "Open Terminal", keywords: ["cli", "console"] },
  { appId: "settings", label: "Open Settings", keywords: ["theme", "preferences"] },
];

/**
 * Builds the full command list for the current context. Rebuilt on every
 * palette open rather than cached, since several entries (repo link,
 * export) depend on values that change as the user navigates.
 */
export function buildCommandList(ctx: CommandContext): Command[] {
  const commands: Command[] = APP_NAV_ITEMS.map((item) => ({
    id: `open:${item.appId}`,
    label: item.label,
    keywords: item.keywords,
    group: "Navigate",
    run: () => ctx.openApp(item.appId),
  }));

  if (ctx.currentRepoUrl) {
    commands.push({
      id: "view-in-github",
      label: "View in GitHub",
      hint: ctx.currentRepoFullName,
      keywords: ["github", "source", "open"],
      group: "Actions",
      run: () => window.open(ctx.currentRepoUrl, "_blank", "noopener,noreferrer"),
    });
  }

  if (ctx.onCopyLink) {
    commands.push({
      id: "copy-link",
      label: "Copy Link",
      keywords: ["share", "url", "clipboard"],
      group: "Actions",
      run: ctx.onCopyLink,
    });
  }

  if (ctx.onExportReport) {
    commands.push(
      {
        id: "export-csv",
        label: "Export Report as CSV",
        keywords: ["export", "download", "csv"],
        group: "Actions",
        run: () => ctx.onExportReport?.("csv"),
      },
      {
        id: "export-json",
        label: "Export Report as JSON",
        keywords: ["export", "download", "json"],
        group: "Actions",
        run: () => ctx.onExportReport?.("json"),
      }
    );
  }

  commands.push(
    {
      id: "shutdown",
      label: "Shut Down",
      keywords: ["logout", "sign out", "power off"],
      group: "System",
      run: () => ctx.navigate("/shutdown"),
    },
    {
      id: "restart",
      label: "Restart",
      keywords: ["reboot", "reload"],
      group: "System",
      run: () => ctx.navigate("/restart"),
    }
  );

  return commands;
}
