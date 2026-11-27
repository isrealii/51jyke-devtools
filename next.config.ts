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
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
