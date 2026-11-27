import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache is configured on purpose: every route is prerendered as static content
// (see the build summary), so there is nothing to revalidate at runtime. Adding R2 + the
// WORKER_SELF_REFERENCE binding here is only needed once a route starts using `use cache`
// or ISR; see https://opennext.js.org/cloudflare/caching.
export default defineCloudflareConfig({});
