/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Objects/Image.tsx

import React, { useState } from "react";
import { ImageObject } from "../WhiteboardTypes";

interface ImageProps {
  object: ImageObject;
  selected: boolean;
}

export const Image: React.FC<ImageProps> = ({ object, selected }) => {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="wb-object wb-image"
      style={{
        width: "100%",
        height: "100%",
        outline: selected ? "2px solid #4d7cfe" : "none",
        overflow: "hidden",
        borderRadius: 2,
        background: "#f2f3f5",
      }}
    >
      {!errored ? (
        <img
          src={object.src}
          alt={object.alt}
          onError={() => setErrored(true)}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9aa0ac",
            fontSize: 12,
          }}
        >
          Image failed to load
        </div>
      )}
    </div>
  );
};

export default Image;
