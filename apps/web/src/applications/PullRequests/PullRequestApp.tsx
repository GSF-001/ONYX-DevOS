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

import { usePullRequestData } from "./PullRequestHooks";
import { PullRequestWindow } from "./PullRequestWindow";
import "./PullRequestStyles.css";

export default function PullRequestApp() {
  const data = usePullRequestData();
  return <PullRequestWindow data={data} />;
}
