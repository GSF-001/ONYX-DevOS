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

import { useInsightsData } from "./InsightsHooks";
import { InsightsWindow } from "./InsightsWindow";
import "./InsightsStyles.css";

export default function InsightsApp() {
  const data = useInsightsData();
  return <InsightsWindow data={data} />;
}
