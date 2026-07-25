// Objects/Icon.tsx

import React from "react";
import { IconObject } from "../WhiteboardTypes";

interface IconProps {
  object: IconObject;
  selected: boolean;
}

const ICON_PATHS: Record<string, string> = {
  star: "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z",
  heart:
    "M12 21s-6.7-4.3-9.3-8.1C.8 10.1 1.6 6.6 4.6 5.2 6.9 4.1 9.5 5 11 7c1.5-2 4.1-2.9 6.4-1.8 3 1.4 3.8 4.9 1.9 7.7C18.7 16.7 12 21 12 21z",
  check: "M20 6L9 17l-5-5",
  flag: "M4 2v20M4 4h14l-3 4 3 4H4",
  bolt: "M13 2L3 14h7l-1 8 10-12h-7z",
};

export const Icon: React.FC<IconProps> = ({ object, selected }) => {
  const path = ICON_PATHS[object.name] ?? ICON_PATHS.star;
  const strokeOnly = object.name === "check" || object.name === "flag";

  return (
    <svg
      className="wb-object wb-icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      style={{ outline: selected ? "1px solid #4d7cfe" : "none" }}
    >
      <path
        d={path}
        fill={strokeOnly ? "none" : object.color}
        stroke={strokeOnly ? object.color : "none"}
        strokeWidth={strokeOnly ? 2 : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Icon;
