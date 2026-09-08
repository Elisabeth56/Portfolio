import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Elisabeth Nnamani — AI Software Engineer";

export default async function OpengraphImage() {
  const portrait = await readFile(
    join(process.cwd(), "public/img/portrait-og.jpg"),
  ).then(
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
          background: "#0e0e10",
          color: "#e8e6e1",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 56px 52px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 22,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#6a6862",
              }}
            >
              elisynth / os
            </span>
            <span
              style={{
                marginTop: 40,
                fontSize: 82,
                fontWeight: 800,
                lineHeight: 0.92,
                letterSpacing: -2.5,
                textTransform: "uppercase",
                maxWidth: 640,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              Systems that survive contact with reality
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>
              Elisabeth Nnamani
            </span>
            <span style={{ marginTop: 10, fontSize: 24, color: "#96938c" }}>
              AI Software Engineer · Nigeria
            </span>
          </div>
        </div>

        {portrait && (
          <div style={{ display: "flex", width: 400, position: "relative" }}>
            <img
              src={portrait}
              alt=""
              width={400}
              height={630}
              style={{ objectFit: "cover", objectPosition: "top center" }}
            />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 8,
            background: "#e97a9b",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
