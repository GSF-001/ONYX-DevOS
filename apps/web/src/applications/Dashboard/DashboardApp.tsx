import { useDashboardData } from "./DashboardHooks";
import { DashboardWindow } from "./DashboardWindow";
import "./DashboardStyles.css";

/**
 * Entry component registered in WINDOW_REGISTRY under "dashboard". Owns
 * data-fetching (via useDashboardData) and hands the loaded state down to
 * DashboardWindow, which is pure presentation.
 */
export default function DashboardApp() {
  const data = useDashboardData();
  return <DashboardWindow data={data} />;
}
