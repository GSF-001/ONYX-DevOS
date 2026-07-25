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

// BranchSidebar.tsx
import { useState } from "react";
import { useGitGraphState } from "./GitGraphHooks";
import { checkoutBranch, createBranch, deleteBranch } from "./GitGraphCommands";

export default function BranchSidebar() {
  const { branches, selectedCommitHash } = useGitGraphState();
  const [newBranchName, setNewBranchName] = useState("");
  const local = branches.filter((b) => !b.isRemote);
  const remote = branches.filter((b) => b.isRemote);

  const handleCreate = () => {
    if (!selectedCommitHash) return;
    const result = createBranch(newBranchName.trim(), selectedCommitHash);
    if (result.ok) setNewBranchName("");
  };

  return (
    <aside className="branch-sidebar">
      <div className="branch-sidebar-section">
        <h3 className="branch-sidebar-heading">Local</h3>
        <ul className="branch-sidebar-list">
          {local.map((branch) => (
            <li key={branch.name} className={branch.isCurrent ? "branch-item current" : "branch-item"}>
              <span className="branch-item-color" style={{ background: branch.color }} />
              <button className="branch-item-name" onClick={() => checkoutBranch(branch.name)}>
                {branch.name}
              </button>
              {!branch.isCurrent && (
                <button
                  className="branch-item-delete"
                  aria-label={`Delete ${branch.name}`}
                  onClick={() => deleteBranch(branch.name)}
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="branch-sidebar-section">
        <h3 className="branch-sidebar-heading">Remote</h3>
        <ul className="branch-sidebar-list">
          {remote.map((branch) => (
            <li key={branch.name} className="branch-item remote">
              <span className="branch-item-color" style={{ background: branch.color }} />
              <span className="branch-item-name">{branch.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="branch-sidebar-create">
        <input
          className="branch-sidebar-input"
          placeholder="new-branch-name"
          value={newBranchName}
          onChange={(e) => setNewBranchName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <button
          className="branch-sidebar-create-button"
          onClick={handleCreate}
          disabled={!selectedCommitHash || !newBranchName.trim()}
          title={selectedCommitHash ? "Branch from selected commit" : "Select a commit first"}
        >
          Branch here
        </button>
      </div>
    </aside>
  );
}
