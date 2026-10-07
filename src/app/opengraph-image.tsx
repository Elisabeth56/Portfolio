import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.role}`;

/* The desk in one frame: paper, the headline with its mulberry underline, the portrait. */
export default async function OpengraphImage() {
  const portrait = await readFile(join(process.cwd(), "public/img/portrait-og.jpg")).then(
    (b) => `data:image/jpeg;base64,${b.toString("base64")}`,
    () => null,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 72px",
          background: "#f0eeeb",
          color: "#292826",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 26, fontWeight: 600 }}>{site.name}</span>
          <span
            style={{
              marginTop: 36,
              fontSize: 72,
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: -2.5,
            }}
          >
            Systems that survive contact with reality
          </span>
          <div
            style={{
              marginTop: 18,
              width: 420,
              height: 6,
              borderRadius: 6,
              background: "#7a2e4b",
              display: "flex",
            }}
          />
          <span style={{ marginTop: 36, fontSize: 26, color: "#54524f" }}>
            {site.role} · {site.location}
          </span>
        </div>

        {portrait && (
          <div
            style={{
              display: "flex",
              width: 340,
              height: 440,
              borderRadius: 32,
              overflow: "hidden",
              background: "#e9e6e1",
            }}
          >
            <img
              src={portrait}
              alt=""
              width={340}
              height={440}
              style={{ objectFit: "cover", objectPosition: "top center" }}
            />
          </div>
        )}
      </div>
    ),
    size,
  );
}
