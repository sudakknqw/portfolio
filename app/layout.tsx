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

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// One source for the tab title and every link preview (Telegram, iMessage, Slack, X…)
const title = "sudakknqw — Software developer";
const description =
  "Good software starts below the surface: data model, access rules and security are settled before the first screen. Currently working on web products and automation.";

export const metadata: Metadata = {
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
    card: "summary",
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
