import { ImageResponse } from "next/og";

export const alt = "Jessica Haynes — Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#fdf6f6",
          backgroundImage: "linear-gradient(135deg, #fbe6ef 0%, #fdf6f6 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 72,
            height: 72,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #b8306f, #8f5f86)",
            marginBottom: 36,
          }}
        >
          <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 7 L18.2 13.8 25 16 18.2 18.2 16 25 13.8 18.2 7 16 13.8 13.8 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#b8306f",
            marginBottom: 16,
          }}
        >
          Senior Software Engineer
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            color: "#2b1f27",
            lineHeight: 1,
            marginBottom: 28,
          }}
        >
          Jessica Haynes
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#6b5761",
            maxWidth: 900,
          }}
        >
          C#/.NET · Backend + Full Stack · AI-Assisted Development
        </div>
      </div>
    ),
    { ...size },
  );
}
