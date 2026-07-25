/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useNavigate } from "react-router-dom";
import { BootLogo } from "./BootLogo";
import { BootProgress } from "./BootProgress";
import { useBootState } from "./BootState";
import { BOOT_READY_MESSAGE, BOOT_WELCOME_MESSAGE } from "./BootSequence";
import { TOKENS } from "../theme";

export function BootScreen() {
  const navigate = useNavigate();
  const { steps, isComplete } = useBootState(() => {
    setTimeout(() => navigate("/desktop", { replace: true }), 900);
  });

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: TOKENS.zIndex.boot,
        boxSizing: "border-box",
        padding: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <p
          style={{
            fontFamily: "var(--win-font-mono, monospace)",
            fontSize: 15,
            color: "#e0e0e0",
            margin: "0 0 12px",
          }}
        >
          ONYX ENGINEERING WORKSTATION v1.0.0
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <BootProgress steps={steps} />
          </div>
          <BootLogo />
        </div>

        {isComplete && (
          <div style={{ marginTop: 12, fontFamily: "var(--win-font-mono, monospace)", fontSize: 11 }}>
            <p style={{ color: "#33FF66", fontWeight: 700, margin: 0 }}>{BOOT_READY_MESSAGE}</p>
            <p style={{ color: "#e0e0e0", margin: "2px 0 0" }}>{BOOT_WELCOME_MESSAGE}</p>
          </div>
        )}
      </div>
    </div>
  );
}
