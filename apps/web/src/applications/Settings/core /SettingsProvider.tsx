import { useEffect } from "react";
import { initSettings } from "./SettingsEngine";

// register modules
import "../modules/appearance";
import "../modules/sound";
import "../modules/keyboard";
import "../modules/workspace";

type Props = {
  children: React.ReactNode;
};

export const SettingsProvider = ({ children }: Props) => {
  useEffect(() => {
    initSettings();
  }, []);

  return <>{children}</>;
};
