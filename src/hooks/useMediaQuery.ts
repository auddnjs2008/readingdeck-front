"use client";

import { useEffect, useState } from "react";

const MD_BREAKPOINT = 768;

/**
 * Returns true when viewport width is >= md (768px).
 * Returns false during SSR to avoid hydration mismatch.
 */
export function useMediaQuery(query: string = `(min-width: ${MD_BREAKPOINT}px)`): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
