import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "51JYKE DevTools — SQL Dialect Converter",
    short_name: "51JYKE DevTools",
    description: "Parser-first SQL dialect converter for PostgreSQL, MySQL, SQL Server/T-SQL, SQLite and Oracle. Runs in your browser.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#fbfaf7",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
