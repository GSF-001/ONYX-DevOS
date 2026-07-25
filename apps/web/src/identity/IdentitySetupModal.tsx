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

import { useCallback, useEffect, useState } from "react";
import { IdentityAPI } from "./IdentityAPI";
import { GenderAvatar } from "./GenderAvatar";
import { LoadingSpinner } from "../shared/components";
import type { Gender } from "./IdentityTypes";

interface IdentitySetupModalProps {
  onClose: () => void;
  onConfirmed: () => void;
}

export function IdentitySetupModal({ onClose, onConfirmed }: IdentitySetupModalProps) {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>("male");
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCandidates = useCallback(async () => {
    setLoadingCandidates(true);
    setError(null);
    try {
      const list = await IdentityAPI.getCandidates();
      setCandidates(list);
      setSelected(list[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate identities.");
    } finally {
      setLoadingCandidates(false);
    }
  }, []);

  useEffect(() => {
    void loadCandidates();
  }, [loadCandidates]);

  const handleConfirm = async () => {
    if (!selected) return;
    setConfirming(true);
    setError(null);
    try {
      await IdentityAPI.confirm(selected, gender);
      onConfirmed();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm identity.");
    } finally {
      setConfirming(false);
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
      <div className="win-frame" style={{ width: 500, padding: 20 }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Set Up Your ONYX Identity</h2>
        <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 14 }}>
          Pick an avatar and handle. Used publicly across ONYX instead of your real identity.
        </p>

        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 6 }}>AVATAR</p>
          <div style={{ display: "flex", gap: 8 }}>
            {(["male", "female"] as Gender[]).map((g) => (
              <div
                key={g}
                onClick={() => setGender(g)}
                style={{
                  padding: 6,
                  borderRadius: 2,
                  cursor: "default",
                  border: gender === g ? "2px solid var(--win-accent)" : "2px solid transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <GenderAvatar gender={g} size={44} />
                <span style={{ fontSize: 11, textTransform: "capitalize" }}>{g}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            {loadingCandidates ? (
              <LoadingSpinner label="Generating identities..." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 180, overflowY: "auto" }}>
                {candidates.map((handle) => (
                  <div
                    key={handle}
                    onClick={() => setSelected(handle)}
                    style={{
                      padding: "6px 10px",
                      fontFamily: "var(--win-font-mono)",
                      fontSize: 12,
                      cursor: "default",
                      borderRadius: 2,
                      background: selected === handle ? "var(--win-titlebar-active)" : "transparent",
                      color: selected === handle ? "var(--win-titlebar-text)" : "inherit",
                    }}
                  >
                    {handle}
                  </div>
                ))}
              </div>
            )}
            <button
              className="win-button"
              onClick={loadCandidates}
              disabled={loadingCandidates}
              style={{ width: "auto", padding: "5px 12px", marginTop: 10, fontSize: 11 }}
            >
              {loadingCandidates ? "Generating..." : "Generate Again"}
            </button>
          </div>

          <div style={{ width: 130, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <GenderAvatar gender={gender} size={70} />
          </div>
        </div>

        {error && <p style={{ color: "var(--win-danger)", fontSize: 11, marginTop: 10 }}>{error}</p>}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button className="win-button" style={{ width: "auto", padding: "5px 14px" }} onClick={onClose}>
            Cancel
          </button>
          <button
            className="win-button"
            disabled={!selected || confirming}
            onClick={handleConfirm}
            style={{ width: "auto", padding: "5px 14px" }}
          >
            {confirming ? "Confirming..." : "Confirm Identity"}
          </button>
        </div>
      </div>
    </div>
  );
}
