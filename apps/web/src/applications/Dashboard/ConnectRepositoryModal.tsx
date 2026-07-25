/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useEffect, useState } from "react";
import { createRepository, getAvailableRepositories, getMyTeams, type AvailableRepository } from "../../shared/api";
import { LoadingSpinner } from "../../shared/components";

interface ConnectRepositoryModalProps {
  onClose: () => void;
  onConnected: () => void;
}

export function ConnectRepositoryModal({ onClose, onConnected }: ConnectRepositoryModalProps) {
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
      const teams = await getMyTeams();
      const team = teams[0]?.team;
      if (!team) throw new Error("No workspace found.");

      await createRepository({ teamId: team.id, owner: repo.owner, name: repo.name });
      onConnected();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect repository.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="win-frame"
        style={{ width: 460, padding: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Connect a Repository</h2>
        <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 16 }}>
          Pick another GitHub repository to track alongside your existing ones.
        </p>

        {loading ? (
          <LoadingSpinner label="Loading your repositories..." />
        ) : repos.length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--win-text-dim)" }}>
            No more available repositories found on your GitHub account.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 240, overflowY: "auto" }}>
            {repos.map((repo) => (
              <div
                key={repo.githubRepoId}
                onClick={() => setSelected(repo.githubRepoId)}
                style={{
                  padding: "7px 10px",
                  fontFamily: "var(--win-font-mono)",
                  fontSize: 12,
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

        {error && <p style={{ color: "var(--win-danger)", fontSize: 11, marginTop: 10 }}>{error}</p>}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button className="win-button" style={{ width: "auto", padding: "5px 14px" }} onClick={onClose}>
            Cancel
          </button>
          <button
            className="win-button"
            disabled={!selected || connecting}
            onClick={handleConnect}
            style={{ width: "auto", padding: "5px 14px" }}
          >
            {connecting ? "Connecting..." : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}
