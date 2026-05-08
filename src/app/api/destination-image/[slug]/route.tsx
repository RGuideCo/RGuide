import { ImageResponse } from "next/og";

export const runtime = "edge";
export const revalidate = 86400;

const WIDTH = 1200;
const HEIGHT = 630;

const titleOverrides: Record<string, string> = {
  "new-york-city": "New York City",
  "washington-dc": "Washington, DC",
  "hong-kong": "Hong Kong",
  "macau": "Macau",
  "kuala-lumpur": "Kuala Lumpur",
  "sao-paulo": "Sao Paulo",
};

const palettes = [
  {
    background: "#f7efe4",
    ink: "#18212f",
    muted: "#6b5f53",
    accent: "#dd6b20",
    secondary: "#0f766e",
  },
  {
    background: "#e9f1ee",
    ink: "#14213d",
    muted: "#52636d",
    accent: "#c2410c",
    secondary: "#2563eb",
  },
  {
    background: "#f2efe8",
    ink: "#1f2937",
    muted: "#6b7280",
    accent: "#b45309",
    secondary: "#047857",
  },
  {
    background: "#edf2f7",
    ink: "#111827",
    muted: "#64748b",
    accent: "#dc2626",
    secondary: "#7c3aed",
  },
];

function hashString(value: string) {
  return value.split("").reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function titleize(slug: string) {
  if (titleOverrides[slug]) {
    return titleOverrides[slug];
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await context.params;
  const { searchParams } = new URL(request.url);
  const slug = decodeURIComponent(rawSlug || "destination")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase()
    .replace(/-v\d+$/, "");
  const includeTitle = searchParams.get("title") === "1";
  const title = titleize(slug || "destination");
  const hash = hashString(slug);
  const palette = palettes[hash % palettes.length];
  const waypointX = 230 + (hash % 640);
  const waypointY = 170 + ((hash >>> 5) % 270);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: palette.background,
          color: palette.ink,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `linear-gradient(135deg, ${palette.background} 0%, #ffffff 48%, ${palette.secondary}22 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 80,
            width: 1020,
            height: 470,
            border: `2px solid ${palette.ink}18`,
            borderRadius: 44,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 120,
            right: 150,
            height: 250,
            display: "flex",
            opacity: 0.62,
          }}
        >
          <svg width="900" height="250" viewBox="0 0 900 250" fill="none">
            <path
              d={`M30 194 C160 82 260 238 382 126 C512 6 614 250 760 80 C812 20 854 42 882 18`}
              stroke={palette.ink}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="2 22"
            />
            <path
              d={`M48 58 C168 126 218 24 342 88 C482 160 556 32 690 98 C764 134 816 116 870 174`}
              stroke={palette.secondary}
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            left: waypointX,
            top: waypointY,
            width: 104,
            height: 104,
            borderRadius: 52,
            background: palette.accent,
            border: "10px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              background: "white",
              display: "flex",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 132,
            top: 104,
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: palette.muted,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          <span>RGuide</span>
          <span style={{ color: palette.accent }}>Destination Guide</span>
        </div>
        {includeTitle ? (
          <div
            style={{
              position: "absolute",
              left: 132,
              right: 132,
              bottom: 108,
              display: "flex",
              fontSize: title.length > 24 ? 72 : 92,
              lineHeight: 0.96,
              fontWeight: 800,
              letterSpacing: -2,
              color: palette.ink,
            }}
          >
            {title}
          </div>
        ) : null}
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    },
  );
}
