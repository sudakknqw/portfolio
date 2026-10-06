import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import ConsoleGreeting from "@/components/ConsoleGreeting";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Providers from "@/components/Providers";
import "./globals.css";

// Two voices, mixed letter by letter in headlines: a tight grotesk and an italic serif
const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

// Explicit fallback: also changes the font hash, which a stale Vercel build cache had split
// between the page and its CSS (the page pointed at a class the stylesheet no longer defined)
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "Consolas", "monospace"],
});

// One source for the tab title and every link preview (Telegram, iMessage, Slack, X…)
const title = "sudakknqw — Full-stack developer";
const description =
  "Full-stack developer. I build what a business runs on: websites, web apps, internal tools and integrations. Schema, access rules and edge cases come first.";

export const metadata: Metadata = {
  // Turns the generated preview image path into an absolute URL that messengers can fetch
  metadataBase: new URL("https://sudakknqw.com"),
  title,
  description,
  openGraph: {
    type: "website",
    siteName: "sudakknqw",
    locale: "en_US",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#100C09",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <Providers>
          {children}
          <Cursor />
          <ConsoleGreeting />
          <Preloader />
        </Providers>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
