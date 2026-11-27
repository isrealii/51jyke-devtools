import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested does not exist. Use the converter or read about the supported SQL dialects.",
};

export default function NotFound() {
  return (
    <main className="mx-auto w-[calc(100%-40px)] max-w-[820px] py-14 sm:py-20">
      <p className="font-mono text-xs uppercase text-green">404</p>
      <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft">This URL does not point to anything on 51JYKE DevTools. The converter lives on the home page, and the about page documents supported dialects and limits.</p>
      <nav className="mt-8 flex flex-wrap gap-4 text-sm" aria-label="Not found navigation">
        <Link className="rounded border border-line px-4 py-2 text-ink transition-colors hover:text-clay" href="/">Open the SQL converter</Link>
        <Link className="rounded border border-line px-4 py-2 text-ink transition-colors hover:text-clay" href="/about">About this tool</Link>
      </nav>
    </main>
  );
}
