import { useActivityData } from "./ActivityHooks";
import { ActivityWindow } from "./ActivityWindow";
import "./ActivityStyles.css";

export default function ActivityApp() {
  const data = useActivityData();
  return <ActivityWindow data={data} />;
}
