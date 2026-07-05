import { useEffect } from "react";

/** Focuses the window's root element when `isFocused` flips true, so
 * keyboard events (Esc, shortcuts) target the right window. */
export function useAutoFocusElement(ref: React.RefObject<HTMLElement>, isFocused: boolean): void {
  useEffect(() => {
    if (isFocused) ref.current?.focus({ preventScroll: true });
  }, [isFocused, ref]);
}

/** Runs `onOutsideClick` when a pointerdown happens outside `ref`'s subtree
 * — used for dismissing context menus and dropdown menus. */
export function useClickOutside(ref: React.RefObject<HTMLElement>, onOutsideClick: () => void): void {
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutsideClick();
    };
    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, [ref, onOutsideClick]);
}
