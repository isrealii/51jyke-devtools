import type { MetadataRoute } from "next";

// Bump this date whenever the page content changes; a static value keeps the
// sitemap prerenderable under Cache Components (a bare `new Date()` is a
// build-time error here).
const lastModified = new Date("2026-11-27T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://51jyke.com/", lastModified, changeFrequency: "monthly", priority: 1 },
    { url: "https://51jyke.com/about", lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}
