"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // A cache-first service worker fights every dev-mode code change (Turbopack's
    // dev chunk URLs are stable, not content-hashed, so a stale cache entry never
    // gets invalidated). Only register it for real, deployed builds.
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is a progressive enhancement; ignore failures.
    });
  }, []);

  return null;
}
