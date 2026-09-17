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

export const metadata: Metadata = {
  title: "sudakknqw · Landing pages, web apps & automation",
  description: "Freelance developer building landing pages, booking systems and workflow automations on a secure, well-structured codebase.",
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
