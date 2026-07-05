import { usePullRequestData } from "./PullRequestHooks";
import { PullRequestWindow } from "./PullRequestWindow";
import "./PullRequestStyles.css";

export default function PullRequestApp() {
  const data = usePullRequestData();
  return <PullRequestWindow data={data} />;
}
