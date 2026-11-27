import { ImageResponse } from "next/og";

export const socialImageSize = { width: 1200, height: 630 };
export const socialImageContentType = "image/png";
export const socialImageAlt = "51JYKE DevTools — SQL Dialect Converter";

const dialects = ["PostgreSQL", "MySQL", "SQL Server", "SQLite", "Oracle"];

type SocialImageOptions = {
  title?: string;
  subtitle?: string;
  footer?: string;
};

export function renderSocialImage({
  title = "SQL Dialect Converter",
  subtitle = "Parser-first conversion across five configured dialects",
  footer = "Runs in your browser · Free to use · No ads",
}: SocialImageOptions = {}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fbfaf7",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 10,
              border: "2px solid #9ebbb0",
              backgroundColor: "#e3eeea",
              color: "#17664f",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            51
          </div>
          <div style={{ display: "flex", color: "#17664f", fontSize: 26, fontWeight: 600 }}>
            51JYKE DevTools
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "#25332e", fontSize: 78, fontWeight: 700, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ display: "flex", color: "#68736d", fontSize: 32, marginTop: 24 }}>
            {subtitle}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 34 }}>
            {dialects.map((dialect) => (
              <div
                key={dialect}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid #d9e7dc",
                  backgroundColor: "#eef3f0",
                  color: "#315c4d",
                  fontSize: 24,
                }}
              >
                {dialect}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", color: "#68736d", fontSize: 26 }}>{footer}</div>
      </div>
    ),
    { ...socialImageSize },
  );
}
