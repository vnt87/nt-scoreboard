// src/hooks/useWakeLock.ts
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage the Screen Wake Lock API.
 * Provides functions to request/release wake lock and state for UI.
 */
export function useWakeLock() {
  const [isWakeLockSupported, setIsWakeLockSupported] = useState<boolean>(false);
  const [isWakeLockActive, setIsWakeLockActive] = useState<boolean>(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Check for API support on mount
  useEffect(() => {
    setIsWakeLockSupported(!!(navigator && "wakeLock" in navigator));
  }, []);

  // Request wake lock
  const requestWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) {
      setIsWakeLockSupported(false);
      setIsWakeLockActive(false);
      return Promise.reject(new Error("Screen Wake Lock API not supported"));
    }
    try {
      // @ts-ignore
      const sentinel = await navigator.wakeLock.request("screen");
      wakeLockRef.current = sentinel;
      setIsWakeLockActive(true);

      // Listen for release events
      sentinel.addEventListener("release", () => {
        setIsWakeLockActive(false);
        wakeLockRef.current = null;
      });
      return sentinel;
    } catch (err) {
      setIsWakeLockActive(false);
      wakeLockRef.current = null;
      throw err;
    }
  }, []);

  // Release wake lock
  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {
        // Ignore errors
      }
      wakeLockRef.current = null;
    }
    setIsWakeLockActive(false);
  }, []);

  // Re-acquire wake lock on visibility change
  useEffect(() => {
    const handleVisibility = async () => {
      if (
        document.visibilityState === "visible" &&
        isWakeLockActive &&
        isWakeLockSupported
      ) {
        try {
          await requestWakeLock();
        } catch {
          // Ignore errors
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isWakeLockActive, isWakeLockSupported, requestWakeLock]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, [releaseWakeLock]);

  return {
    isWakeLockSupported,
    isWakeLockActive,
    requestWakeLock,
    releaseWakeLock,
  };
}

// TypeScript type for WakeLockSentinel (not in lib.dom.d.ts for all TS versions)
type WakeLockSentinel = {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: "release", listener: () => void) => void;
};
