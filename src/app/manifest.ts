import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sama Center — Physical Therapy & Rehabilitation",
    short_name: "Sama Center",
    description: "Premium physical therapy & rehabilitation center. Move Better. Live Stronger.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
