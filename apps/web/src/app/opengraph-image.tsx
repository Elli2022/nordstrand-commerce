import { ImageResponse } from "next/og";

export const alt = "Nordstrand — Nordisk heminredning";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #2a4545 0%, #4f6f66 42%, #f5f0e8 100%)",
          color: "#f5f0e8"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p
            style={{
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              opacity: 0.85
            }}
          >
            Headless e-handel
          </p>
          <h1
            style={{
              fontSize: 88,
              lineHeight: 1,
              margin: 0,
              fontWeight: 600
            }}
          >
            Nordstrand
          </h1>
          <p style={{ fontSize: 34, maxWidth: 760, lineHeight: 1.35, opacity: 0.92 }}>
            Next.js · Express · PostgreSQL · Stripe Checkout
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 24,
            opacity: 0.9
          }}
        >
          <span>Textil</span>
          <span>·</span>
          <span>Keramik</span>
          <span>·</span>
          <span>Hem</span>
          <span>·</span>
          <span>Kök</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
