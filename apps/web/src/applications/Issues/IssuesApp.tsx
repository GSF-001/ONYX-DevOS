import { useIssuesData } from "./IssuesHooks";
import { IssuesWindow } from "./IssuesWindow";
import "./IssuesStyles.css";

export default function IssuesApp() {
  const data = useIssuesData();
  return <IssuesWindow data={data} />;
}
