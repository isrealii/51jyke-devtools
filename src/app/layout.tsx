import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = DM_Sans({ variable: "--font-query-sans", subsets: ["latin"] });
const geistMono = IBM_Plex_Mono({ variable: "--font-query-mono", subsets: ["latin"], weight: ["400", "500"] });

const siteUrl = "https://51jyke.com";
const siteName = "51JYKE DevTools";
const siteDescription = "Convert SQL between PostgreSQL, MySQL, SQL Server, SQLite and Oracle in your browser. Parser-first, warnings shown. Free, no ads.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "SQL Dialect Converter | 51JYKE DevTools", template: "%s | 51JYKE DevTools" },
  applicationName: siteName,
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: siteName, title: "SQL Dialect Converter | 51JYKE DevTools", description: "Parser-first SQL conversion for supported syntax across five configured dialects. Browser-local, free to use, and no ads.", url: `${siteUrl}/` },
  twitter: { card: "summary_large_image", title: "SQL Dialect Converter | 51JYKE DevTools", description: "Parser-first SQL conversion for supported syntax across five configured dialects. Browser-local, free to use, and no ads." },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/icon.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: `${siteUrl}/`,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "51JYKE SQL Dialect Converter",
      url: `${siteUrl}/`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript and WebAssembly",
      description: "A parser-first SQL dialect converter for PostgreSQL, MySQL, SQL Server/T-SQL, SQLite, and Oracle. Conversion runs locally in the browser.",
      publisher: { "@id": `${siteUrl}/#organization` },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isPartOf: { "@id": `${siteUrl}/#website` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <script defer src="https://www.pvuv.ai/f.js" data-site="7ZRDtRH7" data-api="https://in.pvuv.ai" />
      </body>
    </html>
  );
}
