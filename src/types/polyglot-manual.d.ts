// Types for the "./manual" entry of @polyglot-sql/sdk.
// The package ships dist/manual.d.ts as `export * from './index'`, which TypeScript cannot resolve
// outside `moduleResolution: bundler` (next build works, a plain `tsc` on the test files does not).
// Declaring the module here keeps every resolution mode honest: the subpath exists, so the runtime
// import in src/lib/sql-converter.ts is not a typo, and the only addition over the root entry is an
// explicit `init({ wasmUrl })`.
declare module "@polyglot-sql/sdk/manual" {
  export * from "@polyglot-sql/sdk";
  export function init(options: { wasmUrl: string | URL }): Promise<void>;
  export function isInitialized(): boolean;
}
