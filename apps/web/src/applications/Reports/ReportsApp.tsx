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

import { useReportsData } from "./ReportsHooks";
import { ReportsWindow } from "./ReportsWindow";
import "./ReportsStyles.css";

export default function ReportsApp() {
  const data = useReportsData();
  return <ReportsWindow data={data} />;
}
