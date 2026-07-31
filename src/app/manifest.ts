import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AccessPH — Accessibility Companion",
    short_name: "AccessPH",
    description:
      "AI accessibility companion for PWDs and seniors in the Philippines: reads text aloud, understands voice commands, and sends emergency alerts.",
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
  };
}
