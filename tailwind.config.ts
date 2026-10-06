import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Two-colour system: one warm black, one orange for everything drawn on it.
        // Change `fg`/`accent` here and the whole site follows.
        ink: "#100C09",
        "ink-2": "#17110D",
        fg: "#FF5A1F",
        accent: "#FF5A1F",
        muted: "rgba(255, 90, 31, 0.55)",
        line: "rgba(255, 90, 31, 0.16)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Type scale: fluid, tight, built for large display sizes.
      fontSize: {
        "display-xxl": ["clamp(3.4rem, 12.5vw, 12.5rem)", { lineHeight: "0.86", letterSpacing: "-0.055em" }],
        "display-xl": ["clamp(2.75rem, 9.4vw, 8.5rem)", { lineHeight: "0.9", letterSpacing: "-0.05em" }],
        "display-l": ["clamp(2.25rem, 5.4vw, 4.75rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-m": ["clamp(1.75rem, 3.6vw, 3rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-s": ["clamp(1.25rem, 2.2vw, 1.75rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        lead: ["clamp(1.0625rem, 1.4vw, 1.25rem)", { lineHeight: "1.55" }],
        "mono-xs": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        marquee: "marquee 5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
