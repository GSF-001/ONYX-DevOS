/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import femaleProfile from "../assets/female-profile.png";
import maleProfile from "../assets/male-profile.png";
import type { Gender } from "./IdentityTypes";

interface GenderAvatarProps {
  gender: Gender;
  size?: number;
}

export function GenderAvatar({ gender, size = 56 }: GenderAvatarProps) {
  const src = gender === "female" ? femaleProfile : maleProfile;
  return (
    <img
      src={src}
      alt={`${gender} avatar`}
      style={{
        width: size,
        height: size,
        borderRadius: "var(--win-radius)",
        border: "1px solid var(--win-border)",
        objectFit: "cover",
        imageRendering: "pixelated",
      }}
    />
  );
}
