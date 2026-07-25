/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useEffect, useRef } from "react";
import GitGraphWindow from "./GitGraphWindow";
import { useGitGraphState } from "./GitGraphHooks";
import { loadRepository } from "./GitGraphCommands";

export default function GitGraphApp() {
  const { commits } = useGitGraphState();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current || commits.length > 0) return;
    hasLoaded.current = true;
    void loadRepository();
  }, [commits.length]);

  return <GitGraphWindow />;
}
