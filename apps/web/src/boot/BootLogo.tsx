/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import bootComputer from "../assets/boot-computer.png";

export function BootLogo() {
  return (
    <img
      src={bootComputer}
      alt="ONYX Boot Computer"
      style={{
        width: 150,
        height: 150,
        imageRendering: "pixelated",
      }}
    />
  );
}
