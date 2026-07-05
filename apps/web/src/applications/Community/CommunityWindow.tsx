import { useState } from "react";
import { AppTitleBar } from "../../shared/components";
import { Feed } from "./Feed";
import { Trending } from "./Trending";
import { Explore } from "./Explore";
import { Projects } from "./Projects";
import { Developers } from "./Developers";
import { Discussions } from "./Discussions";
import { Showcase } from "./Showcase";
import { Events } from "./Events";
import { Leaderboard } from "./Leaderboard";

type Tab = "feed" | "trending" | "explore" | "projects" | "developers" | "discussions" | "showcase" | "events" | "leaderboard";

const TABS: { id: Tab; label: string }[] = [
  { id: "feed", label: "Feed" },
  { id: "trending", label: "Trending" },
  { id: "explore", label: "Explore" },
  { id: "projects", label: "Projects" },
  { id: "developers", label: "Developers" },
  { id: "discussions", label: "Discussions" },
  { id: "showcase", label: "Showcase" },
  { id: "events", label: "Events" },
  { id: "leaderboard", label: "Leaderboard" },
];

export function CommunityWindow() {
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppTitleBar appName="Community" context="ONYX://CORE" />
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)", overflowX: "auto" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="win-button"
            style={{ width: "auto", padding: "6px 10px", border: "none", borderBottom: tab === t.id ? "2px solid var(--win-accent)" : "2px solid transparent", background: "transparent", whiteSpace: "nowrap" }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "feed" && <Feed />}
        {tab === "trending" && <Trending />}
        {tab === "explore" && <Explore />}
        {tab === "projects" && <Projects />}
        {tab === "developers" && <Developers />}
        {tab === "discussions" && <Discussions />}
        {tab === "showcase" && <Showcase />}
        {tab === "events" && <Events />}
        {tab === "leaderboard" && <Leaderboard />}
      </div>
    </div>
  );
}
