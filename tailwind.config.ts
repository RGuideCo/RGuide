import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-host-grotesk)",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      colors: {
        ink: "#0f172a",
        mist: "#f8fafc",
        sand: "#f7f3eb",
        coral: "#f97316",
        pine: "#065f46",
        sea: "#0f766e",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(249, 115, 22, 0.12), transparent 30%), radial-gradient(circle at bottom left, rgba(15, 118, 110, 0.16), transparent 25%)",
      },
    },
  },
  plugins: [],
};

export default config;
