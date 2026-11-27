import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // Only sent over real HTTPS deployments; HSTS is meaningless on http://localhost.
  ...(isProduction ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }] : []),
];

// Next stamps prerendered HTML with `Cache-Control: s-maxage=31536000` (a year) because the page never
// revalidates itself. That is wrong for a document: any shared cache downstream would keep serving the
// old markup long after a redeploy, and Search Console would then read a page that no longer exists in
// the repo. Cloudflare does not edge-cache Worker responses by default (no `cf-cache-status` / `Age` on
// 2026-11-27), so nothing is stale today — this keeps it true once a Cache Rule or another CDN sits in
// front. Hashed assets under /_next/static are untouched: they legitimately keep their immutable header.
const htmlCacheHeaders = [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }];

const nextConfig: NextConfig = {
  // Cache Components stays off deliberately. With it enabled the OpenNext/Workers runtime hangs
  // every page request ("The Workers runtime canceled this request because it detected that your
  // Worker's code had hung") and serves 500 for / and /about, while static assets still return 200.
  // OpenNext does not support the feature yet: https://github.com/opennextjs/opennextjs-cloudflare/pull/1318
  // partialPrefetching requires cacheComponents, so it stays off with it.
  // Re-check both flags after OpenNext announces support, not before.
  cacheComponents: false,
  partialPrefetching: false,
  reactCompiler: true,
  // Hides `x-powered-by: Next.js`. Nothing depends on it; it only advertises the stack.
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Only the two document routes: a later rule with the same key wins over the earlier one.
      { source: "/", headers: htmlCacheHeaders },
      { source: "/about", headers: htmlCacheHeaders },
    ];
  },
};

export default nextConfig;
