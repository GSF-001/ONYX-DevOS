// Objects/Video.tsx

import React, { useRef } from "react";
import { VideoObject } from "../WhiteboardTypes";

interface VideoProps {
  object: VideoObject;
  selected: boolean;
}

export const Video: React.FC<VideoProps> = ({ object, selected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="wb-object wb-video"
      style={{
        width: "100%",
        height: "100%",
        outline: selected ? "2px solid #4d7cfe" : "none",
        overflow: "hidden",
        borderRadius: 2,
        background: "#000",
      }}
    >
      <video
        ref={videoRef}
        src={object.src}
        poster={object.poster}
        autoPlay={object.autoplay}
        loop={object.loop}
        muted={object.autoplay}
        controls
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
};

export default Video;
