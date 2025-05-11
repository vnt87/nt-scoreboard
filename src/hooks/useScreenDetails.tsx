// src/hooks/useScreenDetails.tsx

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Provides details about the screen, including mobile status, orientation, and dimensions.
 * Use this for responsive layouts that depend on orientation and viewport size.
 */
export function useScreenDetails() {
  const [screenDetails, setScreenDetails] = useState(() => ({
    isMobile: typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false,
    isLandscape: typeof window !== "undefined" ? window.matchMedia("(orientation: landscape)").matches : false,
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResizeOrOrientationChange = () => {
      setScreenDetails({
        isMobile: window.innerWidth < MOBILE_BREAKPOINT,
        isLandscape: window.matchMedia("(orientation: landscape)").matches,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResizeOrOrientationChange();

    window.addEventListener("resize", handleResizeOrOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResizeOrOrientationChange);
    };
  }, []);

  return screenDetails;
}
