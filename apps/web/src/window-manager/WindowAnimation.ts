import { TOKENS } from "../theme";

/** Inline style for a window's mount/open transition — scales up slightly
 * from its origin so opening feels like the window "arrives" rather than
 * just appearing. Applied via a CSS class toggled after mount. */
export const WINDOW_OPEN_ANIMATION_CSS = `
  @keyframes win-open {
    from { opacity: 0; transform: scale(0.97); }
    to { opacity: 1; transform: scale(1); }
  }
  .win-frame-animated {
    animation: win-open ${TOKENS.transition.fast};
  }
`;

/** Inline style for the minimize transition — collapses toward the
 * taskbar rather than just disappearing. */
export const WINDOW_MINIMIZE_ANIMATION_CSS = `
  @keyframes win-minimize {
    to { opacity: 0; transform: scale(0.85) translateY(40px); }
  }
  .win-frame-minimizing {
    animation: win-minimize ${TOKENS.transition.normal} forwards;
  }
`;
