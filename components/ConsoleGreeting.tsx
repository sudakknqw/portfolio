"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

// Module-level guard: React Strict Mode runs effects twice in development
let greeted = false;

/** A note for whoever opens DevTools. Renders nothing. */
export default function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;

    const telegram = site.telegram.replace(/^https?:\/\//, "");

    console.log(
      "%cLooking under the hood?",
      "color: #FF4F1A; font-size: 20px; font-weight: bold;"
    );
    // No explicit colour: stays readable in both light and dark DevTools themes
    console.log(`%cLet's talk: ${telegram}`, "font-size: 14px;");
  }, []);

  return null;
}
