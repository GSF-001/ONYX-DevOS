import { useInsightsData } from "./InsightsHooks";
import { InsightsWindow } from "./InsightsWindow";
import "./InsightsStyles.css";

export default function InsightsApp() {
  const data = useInsightsData();
  return <InsightsWindow data={data} />;
}
