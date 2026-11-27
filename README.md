# 51JYKE DevTools

Source code for [51jyke.com](https://51jyke.com).

51JYKE DevTools is a free-to-use, no-ads parser-first SQL dialect converter using the browser-only dynamic `@polyglot-sql/sdk` WebAssembly parser/transpiler. Conversion runs in the browser; SQL query text is not uploaded for conversion. Server rendering and static prerendering do not initialize the engine.

## Supported scope and boundaries

The SDK is configured for PostgreSQL, MySQL, SQL Server/T-SQL, SQLite, and Oracle. Tested statement families include SELECT, WITH, JOIN, aggregation, window expressions, INSERT, UPDATE, and DELETE; actual coverage depends on SDK parser/transpiler support for the specific dialect and syntax. Failures preserve original SQL with structured warnings. Suggested alternative appears only for generated SQL that passes target parsing.

Oracle Modern uses OFFSET/FETCH (12c+); Legacy uses a double-layer ROWNUM wrapper for safe simple SELECT pagination, preserving ordering. Complex shapes are preserved with warnings. Conversion does not guarantee semantic or execution-plan equivalence. Review functions, types, NULL ordering, transactions, and vendor-specific behavior before execution.

## Commands

```bash
npm install
npx tsc --noEmit
npx tsc --module commonjs --target es2020 --outDir .test-build src/lib/sql-converter.ts src/lib/sql-converter.test.ts --esModuleInterop --skipLibCheck
node --test .test-build/sql-converter.test.js
npm run build
npm run start
```

Tests cover initialization, statement families, dialect pagination, Oracle modes, literals/comments/identifiers, multi-statements, parse errors and empty input. `.test-build` is temporary. No lint script is configured.

## Routes and deployment

`/` is the converter; `/about` documents its limits. Verify `/`, `/about`, `/robots.txt` and `/sitemap.xml` after deployment, then submit the sitemap to Search Console.

## SEO and metadata

All social/SEO surface is generated from Next.js file conventions, so there are no static images to maintain:

- `src/app/layout.tsx` holds `metadataBase`, the shared title template, `siteDescription`, the `Viewport` export (`themeColor`), and a JSON-LD `@graph` (`Organization` / `WebSite` / `SoftwareApplication`) rendered once from the root layout.
- `src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx` both render the card defined in `src/lib/social-image.tsx` (1200×630). Keep that component flexbox-only: the `next/og` renderer (Satori) ignores CSS grid.
- Social images follow the route segment: `src/app/about/opengraph-image.tsx` and `src/app/about/twitter-image.tsx` reuse the same component with the about copy, because a page-level `openGraph`/`twitter` export does not inherit the root image. Without those files `/about` would ship no `og:image`.
- `src/app/icon.svg`, `src/app/apple-icon.tsx` (180×180) and the existing `src/app/favicon.ico` are declared again in `src/app/manifest.ts`.
- `src/app/sitemap.ts` uses a fixed `lastModified` constant. A bare `new Date()` breaks prerendering under `cacheComponents`, so bump that date by hand when page content changes.
- `src/app/robots.ts` allows everything and points at the sitemap; it no longer disallows paths that do not exist.
- `src/app/not-found.tsx` exports its own `metadata` (Next adds `robots: noindex` to 404s automatically) and links back to the converter and about page.
- `next.config.ts` sets baseline security headers (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) on `/:path*`. `Strict-Transport-Security` is added only in production builds.

In `next dev` the generated `og:image` / `twitter:image` URLs point at `http://localhost:3000`. That is expected: Next resolves file-convention social images against a local fallback outside production. Production builds emit `https://51jyke.com/opengraph-image`.
