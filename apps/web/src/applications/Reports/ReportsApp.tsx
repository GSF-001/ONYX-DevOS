import { useReportsData } from "./ReportsHooks";
import { ReportsWindow } from "./ReportsWindow";
import "./ReportsStyles.css";

export default function ReportsApp() {
  const data = useReportsData();
  return <ReportsWindow data={data} />;
}
