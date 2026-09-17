import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Manrope } from "next/font/google";
import ConsoleGreeting from "@/components/ConsoleGreeting";
import Cursor from "@/components/Cursor";
import Providers from "@/components/Providers";
import "./globals.css";

// Display: variable grotesque with real weight range (200–800) — the thin/bold contrast is the whole look
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
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
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <Providers>
          {children}
          <Cursor />
          <ConsoleGreeting />
        </Providers>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
