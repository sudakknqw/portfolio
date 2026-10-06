"use client";

import { useId, useState } from "react";
import { site } from "@/lib/site";
import BracketButton from "./BracketButton";

type Notice = { tone: "ok" | "error"; text: string } | null;

/** One field, one button: the answer becomes a ready-to-send Telegram message. */
export default function ContactForm({ inverted = false }: { inverted?: boolean }) {
  const id = useId();
  const [need, setNeed] = useState("");
  const [notice, setNotice] = useState<Notice>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = need.trim();
    if (!trimmed) {
      setNotice({ tone: "error", text: "Add a few words about what you need first." });
      return;
    }

    const text = `Hi! I found you through your portfolio.\nWhat I need: ${trimmed}`;

    // Telegram documents t.me/<username>?text= as a draft pre-fill, but not every client honours it —
    // so the text is also copied. Clipboard write starts before the new tab steals focus.
    const copied = navigator.clipboard?.writeText(text).then(
      () => true,
      () => false
    );
    window.open(`${site.telegram}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");

    setNotice({ tone: "ok", text: "Opening Telegram with your message." });
    copied?.then((ok) => {
      if (ok) setNotice({ tone: "ok", text: "Copied too — paste it if the chat box opens empty." });
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={`${id}-need`} className={`label mb-3 block transition-colors duration-700 ${inverted ? "text-ink/60" : ""}`}>
        What do you need?
      </label>
      <div
        className={`flex flex-wrap items-end gap-x-6 gap-y-5 border-b pb-3 transition-colors duration-500 ${
          inverted ? "border-ink/25 focus-within:border-ink" : "border-fg/25 focus-within:border-fg"
        }`}
      >
        <input
          id={`${id}-need`}
          value={need}
          onChange={(e) => {
            setNeed(e.target.value);
            if (notice?.tone === "error") setNotice(null);
          }}
          placeholder="Landing page, booking system, a fix…"
          maxLength={200}
          autoComplete="off"
          aria-invalid={notice?.tone === "error"}
          className={`min-w-0 flex-1 basis-[16rem] appearance-none rounded-none bg-transparent font-display text-[clamp(1.25rem,2.4vw,2rem)] tracking-[-0.02em] outline-none transition-colors duration-500 ${
            inverted ? "text-ink placeholder:text-ink/40" : "text-fg placeholder:text-fg/35"
          }`}
        />
        <BracketButton type="submit" inverted={inverted} className="text-base md:text-lg">
          Send
        </BracketButton>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 min-h-[1.25rem] text-sm transition-colors duration-700 ${
          inverted ? "text-ink/70" : notice?.tone === "error" ? "text-fg" : "text-fg/60"
        }`}
      >
        {notice?.text}
      </p>
    </form>
  );
}
