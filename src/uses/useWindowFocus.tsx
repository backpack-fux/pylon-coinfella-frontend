import { useEffect, useState } from "react";

export namespace useWindowFocus {
  export interface Return {
    /** Whether the user's cursor is currently focused in this window. */
    isWindowFocused: boolean;
  }
}

/**
 * Hook that returns whether the window is currently focused. Re-evaluates whenever the window's "is
 * focused" state changes.
 */
// Note: Inspired by https://github.com/jpalumickas/use-window-focus/blob/main/src/index.ts.
export function useWindowFocus(): useWindowFocus.Return {
  const [isWindowFocused, setIsWindowFocused] = useState(document.visibilityState === 'visible'); // Focus for first render.

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsWindowFocused(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isWindowFocused };
}

function hasFocus() {
  return document.hasFocus();
}
