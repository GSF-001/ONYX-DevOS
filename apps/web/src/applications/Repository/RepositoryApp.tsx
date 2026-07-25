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

import { useRepositoryData } from "./RepositoryHooks";
import { RepositoryWindow } from "./RepositoryWindow";
import "./RepositoryStyles.css";

export default function RepositoryApp() {
  const data = useRepositoryData();
  return <RepositoryWindow data={data} />;
}
