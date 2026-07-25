/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useGroupsData } from "./GroupsHooks";
import { GroupsWindow } from "./GroupsWindow";
import "./GroupsStyles.css";

export default function GroupsApp() {
  const data = useGroupsData();
  return <GroupsWindow data={data} />;
}
