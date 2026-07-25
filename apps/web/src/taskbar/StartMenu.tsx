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

import { useState } from "react";
import { WINDOW_REGISTRY } from "../window-manager";
import { useNavigate } from "react-router-dom";

interface StartMenuProps {
  onOpenApp: (appId: string) => void;
  onClose: () => void;
}

export function StartMenu({ onOpenApp, onClose }: StartMenuProps) {
  const navigate = useNavigate();
  const [pressedId, setPressedId] = useState<string | null>(null);

  const itemStyle = (id: string): React.CSSProperties => ({
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: 13,
    background: pressedId === id ? "#000080" : "transparent",
    color: pressedId === id ? "#fff" : "#000",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: "100%",
        width: 240,
        background: "#c0c0c0",
        borderTop: "2px solid #fff",
        borderLeft: "2px solid #fff",
        borderRight: "2px solid #444",
        borderBottom: "2px solid #444",
        boxShadow: "4px 4px 8px rgba(0,0,0,.45)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxHeight: 360,
          overflowY: "auto",
        }}
      >
        {Object.values(WINDOW_REGISTRY).map((app) => (
          <div
            key={app.id}
            onTouchStart={() => setPressedId(app.id)}
            onTouchEnd={() => setPressedId(null)}
            onClick={() => {
              onOpenApp(app.id);
              onClose();
            }}
            style={itemStyle(app.id)}
          >
            {app.title}
          </div>
        ))}

        <hr style={{ margin: "4px 0", borderColor: "#888" }} />

        <div
          onTouchStart={() => setPressedId("restart")}
          onTouchEnd={() => setPressedId(null)}
          style={itemStyle("restart")}
          onClick={() => {
            navigate("/restart");
            onClose();
          }}
        >
          Restart
        </div>

        <div
          onTouchStart={() => setPressedId("shutdown")}
          onTouchEnd={() => setPressedId(null)}
          style={itemStyle("shutdown")}
          onClick={() => {
            navigate("/shutdown");
            onClose();
          }}
        >
          Shut Down
        </div>
      </div>
    </div>
  );
}
