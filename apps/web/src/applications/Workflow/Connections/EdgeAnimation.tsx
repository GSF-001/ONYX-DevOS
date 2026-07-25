/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// EdgeAnimation.tsx — marching-ants animated stroke used while an edge carries an active execution token

import React from "react";

interface Props {
  active: boolean;
}

export function useEdgeDashOffset(active: boolean): number {
  const [offset, setOffset] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let raf: number;
    const tick = () => {
      setOffset((o) => (o - 1.5 + 1000) % 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return offset;
}

export function AnimatedFlowDefs() {
  return (
    <defs>
      <marker id="wf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
      </marker>
    </defs>
  );
}
