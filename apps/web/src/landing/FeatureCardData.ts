export interface FeatureCardDatum {
  index: string; // "01".."12"
  title: string;
  screenshotAlt: string;
  bullets: string[];
}

/**
 * The 12-section feature tour shown on the landing page. Order mirrors the
 * product's own navigation (boot -> desktop -> each app), so this doubles
 * as a table of contents for what ONYX actually is.
 */
export const FEATURE_CARDS: FeatureCardDatum[] = [
  {
    index: "01",
    title: "Boot Screen",
    screenshotAlt: "ONYX boot sequence with system checks",
    bullets: [
      "Boots like a real OS, not a page load.",
      "Shows each system check as it initializes.",
      "Sets the tone: this is a workstation, not a dashboard.",
    ],
  },
  {
    index: "02",
    title: "Desktop (Home)",
    screenshotAlt: "ONYX desktop with app icons",
    bullets: [
      "Desktop is mission control — every app is one click away.",
      "Icons can be dragged, renamed, and rearranged.",
      "Your layout is remembered between sessions.",
    ],
  },
  {
    index: "03",
    title: "Dashboard",
    screenshotAlt: "ONYX dashboard with health score and trends",
    bullets: [
      "One health score per repository, updated live.",
      "14-day trend of merged PRs and review speed.",
      "Modular panels you can resize or hide.",
    ],
  },
  {
    index: "04",
    title: "Repository",
    screenshotAlt: "ONYX repository overview window",
    bullets: [
      "Full repo detail: languages, contributors, commit activity.",
      "Webhook status shown at a glance.",
      "Jump straight to GitHub when you need the source.",
    ],
  },
  {
    index: "05",
    title: "Pull Requests",
    screenshotAlt: "ONYX pull request queue window",
    bullets: [
      "Filter by open, waiting, merged, or closed.",
      "See reviewers and age without opening each PR.",
      "One click through to the PR on GitHub.",
    ],
  },
  {
    index: "06",
    title: "Reviews",
    screenshotAlt: "ONYX review queue window",
    bullets: [
      "Review queue sorted by wait time.",
      "Average review time and review load, per person.",
      "Spot who's overloaded before it becomes a bottleneck.",
    ],
  },
  {
    index: "07",
    title: "Insights",
    screenshotAlt: "ONYX insights window with risk metrics",
    bullets: [
      "Bus factor, merge-without-review, stale PRs, in one view.",
      "Each metric explains what it means and why it matters.",
      "Built to catch risk early, not just report history.",
    ],
  },
  {
    index: "08",
    title: "Team",
    screenshotAlt: "ONYX team performance window",
    bullets: [
      "Leaderboard by contributions and review load.",
      "Workload distribution at a glance.",
      "Helps you rebalance work before burnout sets in.",
    ],
  },
  {
    index: "09",
    title: "Terminal",
    screenshotAlt: "ONYX terminal window",
    bullets: [
      "Open any app with a single command.",
      "Built for people who'd rather type than click.",
      "Same actions as the desktop, zero mouse required.",
    ],
  },
  {
    index: "10",
    title: "Heatmap",
    screenshotAlt: "ONYX activity heatmap window",
    bullets: [
      "Commits, reviews, issues, and PRs on one calendar.",
      "Spot weekend work and unsustainable patterns fast.",
      "12-month view, filterable by activity type.",
    ],
  },
  {
    index: "11",
    title: "Reports",
    screenshotAlt: "ONYX reports export window",
    bullets: [
      "Weekly, monthly, or quarterly, generated automatically.",
      "Export to PDF or CSV in one click.",
      "Share a report link instead of a screenshot.",
    ],
  },
  {
    index: "12",
    title: "Settings",
    screenshotAlt: "ONYX settings window with theme picker",
    bullets: [
      "Four themes: Retro, Dark, CRT Green, Modern Light.",
      "Control sounds, notifications, and workspace behavior.",
      "Manage GitHub integrations from one place.",
    ],
  },
];
