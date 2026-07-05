import { useRepositoryData } from "./RepositoryHooks";
import { RepositoryWindow } from "./RepositoryWindow";
import "./RepositoryStyles.css";

export default function RepositoryApp() {
  const data = useRepositoryData();
  return <RepositoryWindow data={data} />;
}
