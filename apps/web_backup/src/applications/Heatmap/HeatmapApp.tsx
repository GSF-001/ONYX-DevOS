/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useHeatmapData } from "./HeatmapHooks";
import { HeatmapWindow } from "./HeatmapWindow";
import "./HeatmapStyles.css";

export default function HeatmapApp() {
  const data = useHeatmapData();
  return <HeatmapWindow data={data} />;
}
