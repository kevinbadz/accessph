import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AccessPH — Accessibility Companion",
    short_name: "AccessPH",
    description:
      "Free accessibility and safety companion for the Philippines: reads text aloud, understands voice commands, sends emergency alerts, and helps riders share their trip before accepting a passenger.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#1d4ed8",
    lang: "en-PH",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // Long-press the home screen icon (Android) or the app icon (iOS 16.4+)
    // to jump straight here — matters most for Emergency, where every second
    // of navigation counts.
    shortcuts: [
      {
        name: "Read Text",
        short_name: "Read",
        description: "Scan and hear text aloud",
        url: "/reader",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Emergency",
        short_name: "Emergency",
        description: "Call or text your emergency contact",
        url: "/emergency",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Share My Trip",
        short_name: "Share Trip",
        description: "Photo, location, and a notified contact before you ride",
        url: "/trip",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
