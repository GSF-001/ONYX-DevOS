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
        background: "#d4d0c8",
        padding: 8,
        overflow: "auto",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderTop: "2px solid #808080",
          borderLeft: "2px solid #808080",
          borderRight: "2px solid #ffffff",
          borderBottom: "2px solid #ffffff",
          minHeight: "100%",
          padding: 12,
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
