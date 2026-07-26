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

import { Suspense, type ComponentType } from "react";
import { LoadingSpinner } from "../shared/components";

interface WindowBodyProps {
  Component: ComponentType;
}

export function WindowBody({ Component }: WindowBodyProps) {
  return (
    <div
      className="win-body"
      style={{
        background: "var(--win-face)",
        padding: 8,
        overflow: "hidden",
        display: "flex",
      }}
    >
      <div
        style={{
          background: "var(--win-field-bg)",
          color: "var(--win-text)",
          borderTop: "2px solid var(--win-face-dark)",
          borderLeft: "2px solid var(--win-face-dark)",
          borderRight: "2px solid var(--win-face-light)",
          borderBottom: "2px solid var(--win-face-light)",
          height: "100%",
          width: "100%",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
          minHeight: 0,
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 32,
              }}
            >
              <LoadingSpinner label="Loading..." />
            </div>
          }
        >
          <Component />
        </Suspense>
      </div>
    </div>
  );
}
