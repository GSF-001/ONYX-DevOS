/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../shared/api";
import { setActiveTeamSlug } from "./workspaceStore";

export function CreateWorkspacePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const team = await createTeam(name.trim());
      setActiveTeamSlug(team.slug);
      navigate("/repository-setup", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workspace.");
    } finally {
      setLoading(false);
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
      <div className="win-frame" style={{ width: 460, padding: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Create Your Workspace</h1>
        <p style={{ fontSize: 12, color: "var(--win-text-dim)", marginBottom: 20 }}>
          A workspace groups your repositories and team members together.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Acme Engineering"
          style={{
            width: "100%",
            padding: "8px 10px",
            fontSize: 13,
            fontFamily: "var(--win-font-mono)",
            background: "var(--win-field-bg)",
            border: "1px solid var(--win-border)",
            color: "var(--win-text)",
            boxSizing: "border-box",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />

        {error && <p style={{ color: "var(--win-danger)", fontSize: 12, marginTop: 10 }}>{error}</p>}

        <button
          className="win-button"
          disabled={loading || !name.trim()}
          onClick={handleCreate}
          style={{ width: "auto", padding: "6px 16px", marginTop: 16, fontSize: 13 }}
        >
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </div>
    </div>
  );
}
