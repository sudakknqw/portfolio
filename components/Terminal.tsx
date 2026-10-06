"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { scrollSpring } from "@/lib/motion";
import { projects } from "@/lib/projects";

/**
 * `cmd` lines are typed letter by letter; output lines appear whole, like a real shell.
 * `extra` is the tail of an output line, dropped on phones so nothing wraps.
 */
type Line = { kind: "cmd" | "out" | "ok" | "dim"; text: string; extra?: string };

const pad = Math.max(...projects.map((p) => p.slug.length)) + 3;

const SCRIPT: Line[] = [
  { kind: "cmd", text: "cd ~/work && npm run show" },
  { kind: "dim", text: "> sudakknqw@work show" },
  { kind: "dim", text: "> next build --selected" },
  { kind: "out", text: "" },
  { kind: "out", text: "  Collecting projects…" },
  ...projects.map((p) => ({ kind: "ok" as const, text: p.slug.padEnd(pad), extra: p.type })),
  { kind: "out", text: "" },
  { kind: "out", text: `  Compiled ${projects.length} projects.`, extra: " Schema checked, access rules on." },
  { kind: "cmd", text: "open ./selected-work" },
];

// Each line costs "ticks" of scroll: one per typed letter, a few for an output line
const cost = (l: Line) => (l.kind === "cmd" ? l.text.length : 4);
const TOTAL = SCRIPT.reduce((n, l) => n + cost(l), 0);

/**
 * Bridge between the hero and the work: a terminal types out a build as you scroll,
 * then the window grows to fill the screen and hands over to the projects.
 */
export default function Terminal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, scrollSpring);

  // Typing runs over the first two thirds of the pinned scroll, the zoom over the rest
  const [ticks, setTicks] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const t = Math.round(Math.min(1, Math.max(0, (v - 0.04) / 0.58)) * TOTAL);
    setTicks((prev) => (prev === t ? prev : t));
  });

  // Then the window opens up while the work section slides over it
  const scale = useTransform(p, [0.64, 1], [1, 1.9]);
  const radius = useTransform(p, [0.64, 1], [18, 0]);
  const fill = useTransform(p, [0.64, 1], ["#17110D", "#100C09"]);
  const textOpacity = useTransform(p, [0.66, 0.85], [1, 0]);
  const chromeOpacity = useTransform(p, [0.7, 0.9], [1, 0]);
  const caption = useTransform(p, [0, 0.08, 0.6, 0.7], [0, 1, 1, 0]);

  // Walk the script, spending ticks
  let left = ticks;
  const shown: { line: Line; text: string; typing: boolean }[] = [];
  for (const line of SCRIPT) {
    if (left <= 0) break;
    const c = cost(line);
    if (line.kind === "cmd") {
      const n = Math.min(line.text.length, left);
      // The last command keeps its cursor: it is "running" as the window opens
      shown.push({ line, text: line.text.slice(0, n), typing: n < line.text.length || line === SCRIPT[SCRIPT.length - 1] });
    } else {
      shown.push({ line, text: line.text, typing: false });
    }
    left -= c;
  }

  return (
    <section
      ref={ref}
      aria-label="Opening selected work"
      className="relative z-10 h-[260svh] rounded-t-[2rem] border-t border-line bg-ink md:rounded-t-[3rem]"
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-4 md:px-10">
        <motion.div
          style={{ scale, borderRadius: radius, backgroundColor: fill }}
          className="relative flex h-[min(70svh,34rem)] w-full max-w-[56rem] flex-col overflow-hidden border border-line shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] will-change-transform"
        >
          {/* Title bar */}
          <motion.div style={{ opacity: chromeOpacity }} className="flex h-10 shrink-0 items-center gap-4 border-b border-line px-4">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-fg/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg/45" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg/20" />
            </span>
            <span className="flex-1 truncate text-center font-mono text-[11px] text-fg/50">zsh — sudakknqw — 80×24</span>
            <span className="w-[42px]" />
          </motion.div>

          {/* Output */}
          <motion.pre
            style={{ opacity: textOpacity }}
            className="flex-1 overflow-hidden whitespace-pre-wrap p-4 font-mono text-[11px] leading-[1.75] text-fg sm:text-[13px] md:p-6 md:text-[15px]"
          >
            {shown.map(({ line, text, typing }, i) => (
              <div key={i} className={line.kind === "dim" ? "text-fg/45" : line.kind === "out" ? "text-fg/70" : ""}>
                {line.kind === "cmd" && <span className="mr-3 text-fg/50">~/work $</span>}
                {line.kind === "ok" && <span className="mr-3">  ✓</span>}
                {text || " "}
                {line.extra && <span className="hidden sm:inline">{line.extra}</span>}
                {typing && <span className="ml-px inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-fg" />}
              </div>
            ))}
            {/* Idle prompt with a blinking block while nothing is being typed */}
            {!shown.some((s) => s.typing) && (
              <div>
                {/* A prompt before anything runs; while output streams, only the cursor */}
                {shown.length === 0 && <span className="mr-3 text-fg/50">~/work $</span>}
                <span className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] animate-pulse bg-fg" />
              </div>
            )}
          </motion.pre>
        </motion.div>

        <motion.p style={{ opacity: caption }} className="label absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          Keep scrolling ↓
        </motion.p>
      </div>
    </section>
  );
}
