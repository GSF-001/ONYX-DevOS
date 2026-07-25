/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRepository, getAvailableRepositories, getMyTeams, type AvailableRepository } from "../shared/api";
import { getActiveTeamSlug } from "./workspaceStore";
import { LoadingSpinner } from "../shared/components";

export function RepositorySetupPage() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState<AvailableRepository[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const list = await getAvailableRepositories();
        setRepos(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load repositories.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleConnect = async () => {
    const repo = repos.find((r) => r.githubRepoId === selected);
    if (!repo) return;

    setConnecting(true);
    setError(null);
    try {
      const slug = getActiveTeamSlug();
      const teams = await getMyTeams();
      const team = teams.find((t) => t.team.slug === slug)?.team ?? teams[0]?.team;
      if (!team) throw new Error("No workspace found — please create one first.");

      await createRepository({ teamId: team.id, owner: repo.owner, name: repo.name });
      navigate("/boot", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect repository.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0e11",
      }}
    >
      <div className="win-frame" style={{ width: 520, padding: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Connect a Repository</h1>
        <p style={{ fontSize: 12, color: "var(--win-text-dim)", marginBottom: 20 }}>
          Pick a GitHub repository to start tracking in ONYX.
        </p>

        {loading ? (
          <LoadingSpinner label="Loading your repositories..." />
        ) : repos.length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--win-text-dim)" }}>
            No available repositories found on your GitHub account.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto" }}>
            {repos.map((repo) => (
              <div
                key={repo.githubRepoId}
                onClick={() => setSelected(repo.githubRepoId)}
                style={{
                  padding: "8px 12px",
                  fontFamily: "var(--win-font-mono)",
                  fontSize: 13,
                  cursor: "default",
                  borderRadius: 2,
                  background: selected === repo.githubRepoId ? "var(--win-titlebar-active)" : "transparent",
                  color: selected === repo.githubRepoId ? "var(--win-titlebar-text)" : "inherit",
                }}
              >
                {repo.fullName} {repo.private ? "🔒" : ""}
              </div>
            ))}
          </div>
        )}

        {error && <p style={{ color: "var(--win-danger)", fontSize: 12, marginTop: 12 }}>{error}</p>}

        <button
          className="win-button"
          disabled={!selected || connecting}
          onClick={handleConnect}
          style={{ width: "auto", padding: "6px 16px", marginTop: 16, fontSize: 13 }}
        >
          {connecting ? "Connecting..." : "Connect Repository"}
        </button>
      </div>
    </div>
  );
}
