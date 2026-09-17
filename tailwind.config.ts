import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        "ink-2": "#121212",
        bone: "#EDEAE4",
        muted: "#8A8782",
        line: "rgba(237, 234, 228, 0.12)",
        // The one accent. Change it here and everything follows.
        accent: "#FF4F1A",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Type scale: fluid, tight, built for large display sizes.
      fontSize: {
        "display-xl": ["clamp(2.5rem, 9.4vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.045em" }],
        "display-l": ["clamp(2.25rem, 6vw, 5.25rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-m": ["clamp(1.75rem, 3.6vw, 3rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-s": ["clamp(1.25rem, 2.2vw, 1.75rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        lead: ["clamp(1.0625rem, 1.4vw, 1.25rem)", { lineHeight: "1.55" }],
        "mono-xs": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
