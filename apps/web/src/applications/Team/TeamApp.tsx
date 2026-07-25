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

import { useTeamData } from "./TeamHooks";
import { TeamWindow } from "./TeamWindow";
import "./TeamStyles.css";

export default function TeamApp() {
  const data = useTeamData();
  return <TeamWindow data={data} />;
}
