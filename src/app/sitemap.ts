import type { MetadataRoute } from "next";

// Build time, not a hand-kept constant. A constant that nobody bumps tells Google the page never
// changed, which is worse than a date that is a little newer than the content: Google ignores an
// inaccurate lastmod rather than penalising it. Deploys here are manual pushes, so the two stay close.
// Still prerendered, not dynamic — `new Date()` is not a dynamic API and Cache Components is off in
// next.config.ts, so the timestamp is frozen into the static response at build time (verified
// 2026-11-27 against `x-nextjs-prerender: 1`).
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // No trailing slash on the root, matching what Next emits for the canonical tag and og:url: it
    // resolves metadata URLs through `new URL(...)` and strips the slash, so `https://51jyke.com/`
    // here would be the only surface spelling it differently. Google folds the two anyway; the point
    // is that a grep for one spelling finds every declaration.
    { url: "https://51jyke.com", lastModified, changeFrequency: "monthly", priority: 1 },
    { url: "https://51jyke.com/about", lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}
