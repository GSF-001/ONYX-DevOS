/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useActivityData } from "./ActivityHooks";
import { ActivityWindow } from "./ActivityWindow";
import "./ActivityStyles.css";

export default function ActivityApp() {
  const data = useActivityData();
  return <ActivityWindow data={data} />;
}
