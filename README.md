# 51JYKE DevTools

Source code for [51jyke.com](https://51jyke.com).

51JYKE DevTools is a free-to-use, no-ads parser-first SQL dialect converter using the browser-only dynamic `@polyglot-sql/sdk` WebAssembly parser/transpiler. Conversion runs in the browser; SQL query text is not uploaded for conversion. The engine binary (`polyglot_sql.wasm`, 27 MiB, all dialects) is fetched from jsDelivr on first use, with unpkg as fallback, because it exceeds Cloudflare's 25 MiB per-asset limit and would otherwise break deployment; see [Engine binary delivery](#engine-binary-delivery). Server rendering and static prerendering do not initialize the engine.

## Supported scope and boundaries

The SDK is configured for PostgreSQL, MySQL, SQL Server/T-SQL, SQLite, and Oracle. Tested statement families include SELECT, WITH, JOIN, aggregation, window expressions, INSERT, UPDATE, and DELETE; actual coverage depends on SDK parser/transpiler support for the specific dialect and syntax. Failures preserve original SQL with structured warnings. Suggested alternative appears only for generated SQL that passes target parsing.

Oracle Modern uses OFFSET/FETCH (12c+); Legacy uses a double-layer ROWNUM wrapper for safe simple SELECT pagination, preserving ordering. Complex shapes are preserved with warnings. Conversion does not guarantee semantic or execution-plan equivalence. Review functions, types, NULL ordering, transactions, and vendor-specific behavior before execution.

## Commands

```bash
npm install
npx tsc --noEmit
npx tsc --module commonjs --target es2020 --outDir .test-build src/lib/sql-converter.ts src/lib/sql-converter.test.ts src/types/polyglot-manual.d.ts --esModuleInterop --skipLibCheck
node --test .test-build/sql-converter.test.js
npm run build     # plain `next build`; the adapter shells out to this script
npm run preview   # OpenNext build + local workerd preview
npm run deploy    # OpenNext build + wrangler deploy
```

Tests cover initialization, statement families, dialect pagination, Oracle modes, literals/comments/identifiers, multi-statements, parse errors and empty input. `.test-build` is temporary. The scratch `tsc` command must list `src/types/polyglot-manual.d.ts`: without it, `@polyglot-sql/sdk/manual` does not resolve under `--module commonjs`. No lint script is configured.

## Routes and deployment

`/` is the converter; `/about` documents its limits. Verify `/`, `/about`, `/robots.txt` and `/sitemap.xml` after deployment, then submit the sitemap to Search Console.

Deployment target is Cloudflare Workers via OpenNext, and the Cloudflare project settings are load-bearing:

| Setting | Value | Why |
|---|---|---|
| Build command | `npx opennextjs-cloudflare build` | `wrangler deploy` delegates to `opennextjs-cloudflare deploy` as soon as it sees `next.config.ts` + `open-next.config.ts` + the adapter installed (`wrangler-dist/cli.js:163329`), and that deploy only accepts a `.open-next/` produced by the OpenNext build. With plain `npm run build` the step fails with `Could not find compiled Open Next config, did you run the build command?` |
| Deploy command | `npx wrangler deploy` | Delegates to the OpenNext deploy, no rebuild |

Do not try to fix this by pointing `package.json`'s `build` script at `opennextjs-cloudflare build`: the adapter invokes `npm run build` itself (`@opennextjs/aws/dist/build/buildNextApp.js`, `buildNextjsApp()`), so that wiring recurses until the process dies.

No incremental cache is configured — every route is prerendered static, so nothing revalidates at runtime; add R2 plus the `WORKER_SELF_REFERENCE` binding only when a route starts using `use cache` or ISR.

## Engine binary delivery

`src/lib/sql-converter.ts` imports `@polyglot-sql/sdk/manual`, not the default entry. The default entry resolves its WebAssembly binary through `new URL("./polyglot_sql.wasm", import.meta.url)`, which makes the bundler emit a 28,281,263-byte asset into `_next/static/media/`; Cloudflare Workers rejects any single asset above 25 MiB, so `wrangler deploy` failed with `Error: Asset too large` while the build itself succeeded. The `./manual` entry is self-contained and takes an explicit `init({ wasmUrl })`, so the binary never enters the build output (total static assets are now under 1 MiB).

Consequences to keep in mind:

- The CDN URLs in `wasmUrls` are pinned to `0.14.0`. Bumping `@polyglot-sql/sdk` without bumping them fails at instantiation in the browser, not at build time.
- First load downloads the 27 MiB binary; jsDelivr serves it compressed, so the transfer is a few MiB. Failures fall back to unpkg, then surface as an initialization error in the UI.
- The CDN sees the visitor's IP when the binary is fetched. Query text still never leaves the browser.
- `next build` / `opennextjs-cloudflare build` no longer warn about oversized assets; if a future dependency reintroduces a large file, `npx wrangler deploy --dry-run` is the fastest check.

## Traffic analytics

`src/app/layout.tsx` carries one hardcoded tag for pvuv.ai, the only traffic measurement on the site:

```html
<script defer src="https://www.pvuv.ai/f.js" data-site="7ZRDtRH7" data-api="https://in.pvuv.ai"></script>
```

- Raw `<script>`, not `next/script`, on purpose. `next/script` with `afterInteractive` injects the tag after hydration, so it never shows up in the prerendered HTML; the raw tag is emitted into `<body>` of `/`, `/about` and the 404 page, which is what makes it checkable with view-source.
- It sits at the end of `<body>`, after `<SiteFooter />`. React renders it in place rather than hoisting it to `<head>`, and serializes `defer` as `defer=""` — same behaviour.
- `next dev` loads it as well, so localhost page views are counted. Gate it on `process.env.NODE_ENV` if that ever skews the numbers.
- Privacy surface: the script sees the visitor's IP, User-Agent and page URL. Same class of exposure as the wasm CDN fetch described above; the SQL text still never leaves the browser.

## SEO and metadata

All social/SEO surface is generated from Next.js file conventions, so there are no static images to maintain:

- `src/app/layout.tsx` holds `metadataBase`, the shared title template, `siteDescription`, the `Viewport` export (`themeColor`), and a JSON-LD `@graph` (`Organization` / `WebSite` / `SoftwareApplication`) rendered once from the root layout.
- `src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx` both render the card defined in `src/lib/social-image.tsx` (1200×630). Keep that component flexbox-only: the `next/og` renderer (Satori) ignores CSS grid.
- Social images follow the route segment: `src/app/about/opengraph-image.tsx` and `src/app/about/twitter-image.tsx` reuse the same component with the about copy, because a page-level `openGraph`/`twitter` export does not inherit the root image. Without those files `/about` would ship no `og:image`.
- `src/app/icon.svg`, `src/app/apple-icon.tsx` (180×180) and the existing `src/app/favicon.ico` are declared again in `src/app/manifest.ts`.
- `src/app/sitemap.ts` stamps both URLs with the build time instead of a hand-bumped constant: a date nobody bumps tells Google the page never changed, while a date slightly newer than the content is merely ignored, not penalised. `new Date()` is evaluated once at build time, not per request — the route still prerenders and answers with `x-nextjs-prerender: 1`. The root URL is written without a trailing slash to match the canonical tag and `og:url`; Next resolves metadata URLs through `new URL(...)` and always emits them slash-free, so one spelling covers all three surfaces.
- `next.config.ts` keeps `cacheComponents` and `partialPrefetching` off. With them enabled, OpenNext on Workers hangs every page request (`The Workers runtime canceled this request because it detected that your Worker's code had hung`) while static assets keep returning 200 — `/` and `/about` answer 500. Do not re-enable until https://github.com/opennextjs/opennextjs-cloudflare/pull/1318 lands.
- `src/app/robots.ts` allows everything and points at the sitemap; it no longer disallows paths that do not exist.
- `src/app/not-found.tsx` exports its own `metadata` (Next adds `robots: noindex` to 404s automatically) and links back to the converter and about page.
- `next.config.ts` sets baseline security headers (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) on `/:path*`. `Strict-Transport-Security` is added only in production builds.
- `next.config.ts` overrides `Cache-Control` on `/` and `/about` with `public, max-age=0, must-revalidate`. Left alone, Next stamps prerendered HTML with `s-maxage=31536000`, which would let any shared cache keep serving the previous markup for a year after a redeploy. Cloudflare does not edge-cache Worker responses today (no `cf-cache-status` or `Age` header), so nothing is stale right now — the override is insurance for the day a Cache Rule or another CDN sits in front. Hashed `/_next/static/*` assets keep their immutable header; the override targets the two document routes only.
- `poweredByHeader: false` drops `x-powered-by: Next.js` from every response.

In `next dev` the generated `og:image` / `twitter:image` URLs point at `http://localhost:3000`. That is expected: Next resolves file-convention social images against a local fallback outside production. Production builds emit `https://51jyke.com/opengraph-image`.
