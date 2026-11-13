import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/*
 * Installed as an app, Chrome uses these icons instead of the favicon. They are
 * full-bleed squares so the system masks them to its own shape; an icon with
 * transparent corners gets set on a white plate instead.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name.split(" ")[0],
    description: site.intro,
    start_url: "/",
    display: "standalone",
    background_color: "#f0eeeb",
    theme_color: "#f0eeeb",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
