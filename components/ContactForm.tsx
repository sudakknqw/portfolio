"use client";

import { useId, useState } from "react";
import { site } from "@/lib/site";
import ArrowLink from "./ArrowLink";
import Select from "./Select";

const BUDGETS = ["Under $150", "$150–500", "$500+", "Not sure yet"];
const TIMELINES = ["ASAP", "Within a week", "No rush"];

/** Turns the answers into a ready-to-send Telegram message. Empty answers are left out. */
function buildMessage(need: string, budget: string, timeline: string) {
  return [
    "Hi! I found you through your portfolio.",
    need && `What I need: ${need}`,
    budget && `Budget: ${budget}`,
    timeline && `Timeline: ${timeline}`,
  ]
    .filter(Boolean)
    .join("\n");
}

type Notice = { tone: "ok" | "error"; text: string } | null;

export default function ContactForm({ inverted = false }: { inverted?: boolean }) {
  const id = useId();
  const [need, setNeed] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [notice, setNotice] = useState<Notice>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = need.trim();
    if (!trimmed) {
      setNotice({ tone: "error", text: "Add a few words about what you need first." });
      return;
    }

    const text = buildMessage(trimmed, budget, timeline);

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

  const field = `w-full appearance-none rounded-none border-b bg-transparent pb-[0.55rem] pt-1 text-base outline-none transition-colors duration-500 ${
    inverted
      ? "border-ink/25 text-ink placeholder:text-ink/45 focus:border-ink"
      : "border-bone/20 text-bone placeholder:text-bone/35 focus:border-accent"
  }`;
  const label = `label mb-2 block transition-colors duration-700 ${inverted ? "text-ink/60" : ""}`;

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-x-6 gap-y-7 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <label htmlFor={`${id}-need`} className={label}>
            What do you need?
          </label>
          <input
            id={`${id}-need`}
            value={need}
            onChange={(e) => {
              setNeed(e.target.value);
              if (notice?.tone === "error") setNotice(null);
            }}
            placeholder="Landing page, automation, a fix…"
            maxLength={200}
            autoComplete="off"
            aria-invalid={notice?.tone === "error"}
            className={field}
          />
        </div>

        <Select label="Budget range" options={BUDGETS} value={budget} onChange={setBudget} inverted={inverted} />
        <Select label="Timeline" options={TIMELINES} value={timeline} onChange={setTimeline} inverted={inverted} />
      </div>

      <div className="mt-[2.4rem] flex flex-wrap items-center gap-x-8 gap-y-3">
        <ArrowLink type="submit" size="ml" inverted={inverted}>
          Send via Telegram
        </ArrowLink>
        <p
          aria-live="polite"
          className={`min-h-[1.25rem] text-sm transition-colors duration-700 ${
            notice?.tone === "error" ? (inverted ? "text-ink" : "text-accent") : inverted ? "text-ink/60" : "text-bone/60"
          }`}
        >
          {notice?.text}
        </p>
      </div>
    </form>
  );
}
