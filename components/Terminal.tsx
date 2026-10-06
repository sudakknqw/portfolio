"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { projects } from "@/lib/projects";

/**
 * `cmd` lines are typed letter by letter; everything else appears whole, like a real shell.
 * `mark` is a gutter symbol (✓, ├, ▲…); `extra` is a line tail dropped on phones so nothing wraps.
 */
type Line = { kind: "cmd" | "out" | "ok" | "dim" | "head"; text: string; mark?: string; extra?: string };

const pad = Math.max(...projects.map((p) => p.slug.length)) + 4;

// Reads like a real `next build`, but the route table is the list of projects that follows
const SCRIPT: Line[] = [
  { kind: "cmd", text: "cd ~/projects && npm run build" },
  { kind: "dim", text: "> selected-work@1.0.0 build" },
  { kind: "dim", text: "> next build" },
  { kind: "out", text: "" },
  { kind: "head", mark: "▲", text: "Next.js 14.2" },
  { kind: "out", text: "  Creating an optimized production build …" },
  { kind: "ok", mark: "✓", text: "Compiled successfully" },
  { kind: "ok", mark: "✓", text: "Schema, access rules, edge cases checked" },
  { kind: "out", text: "" },
  { kind: "head", text: "  Route (projects)" },
  ...projects.map((p, i) => ({
    kind: "out" as const,
    mark: i === projects.length - 1 ? "└ ○" : "├ ○",
    text: `/${p.slug}`.padEnd(pad),
    extra: p.type,
  })),
  { kind: "out", text: "" },
  { kind: "ok", mark: "✓", text: `${projects.length} projects ready` },
  { kind: "cmd", text: "npm start -- --open selected-work" },
  { kind: "head", mark: "▲", text: "Ready. Opening selected work →" },
];

// Each line costs "ticks" of scroll: one per typed letter, a few for an output line
const cost = (l: Line) => (l.kind === "cmd" ? l.text.length : 4);
const TOTAL = SCRIPT.reduce((n, l) => n + cost(l), 0);

// Scroll ranges (0…1 of the pinned stretch)
const TYPE = [0.03, 0.48] as const; // the build types out
const NOISE = [0.5, 0.68] as const; // terminal text breaks into glyphs
const DECODE = [0.6, 0.9] as const; // the heading resolves letter by letter

// Fastest the sequence may advance (share of the whole per second), and the glyph shimmer rate
const MAX_SPEED = 0.55;
const SHIMMER_MS = 70;

const GLYPHS = "!<>-_\\/[]{}=+*^?#%&$01░▒";
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (v: number, [a, b]: readonly [number, number]) => clamp01((v - a) / (b - a));

/** Cheap deterministic noise: same scroll position, same glyphs (no flicker while still) */
function hash(i: number, seed: number) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const glyph = (i: number, seed: number) => GLYPHS[Math.floor(hash(i, seed) * GLYPHS.length)];

/** Replaces a share of a string's letters with glyphs; `offset` keeps lines from scrambling in sync */
function scramble(text: string, amount: number, seed: number, offset: number) {
  if (amount <= 0) return text;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    out += ch !== " " && hash(i + offset, 7) < amount ? glyph(i + offset, seed) : ch;
  }
  return out;
}

// The heading the noise decodes into: letters with their typeface
const HEADING: { ch: string; serif: boolean; dim: boolean }[] = [
  ..."Selected".split("").map((ch) => ({ ch, serif: false, dim: false })),
  { ch: " ", serif: false, dim: false },
  { ch: "{", serif: true, dim: true },
  ..."work".split("").map((ch) => ({ ch, serif: true, dim: false })),
  { ch: "}", serif: true, dim: true },
];

/**
 * Bridge between the hero and the work: a terminal types out a build as you scroll,
 * its output breaks into noise, and the noise decodes into the "Selected {work}" heading.
 */
export default function Terminal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const reduced = useReducedMotion();

  // The animation chases the scroll position with a capped speed, so a fast flick of the wheel
  // plays the sequence out smoothly (catching up a moment later) instead of jumping through it
  const p = useMotionValue(0);
  const [frame, setFrame] = useState({ v: 0, seed: 0 });
  useAnimationFrame((time, delta) => {
    const target = scrollYProgress.get();
    const cur = p.get();
    if (reduced || Math.abs(target - cur) < 0.0005) {
      if (cur !== target) p.set(target);
    } else {
      const dt = Math.min(delta, 50) / 1000;
      const eased = (target - cur) * (1 - Math.exp(-dt * 5));
      // Speeds up when far behind, so a fast scroll never leaves the heading half-decoded for long
      const cap = dt * (MAX_SPEED + Math.abs(target - cur) * 2);
      p.set(cur + Math.max(-cap, Math.min(cap, eased)));
    }

    // Re-render only when something visible changes: the position, or the glyph shimmer mid-transition
    const v = Math.round(p.get() * 400) / 400;
    const shimmering = v > NOISE[0] && v < DECODE[1];
    const seed = shimmering && !reduced ? Math.floor(time / SHIMMER_MS) : 0;
    setFrame((f) => (f.v === v && f.seed === seed ? f : { v, seed }));
  });

  const { v, seed } = frame;
  const ticks = Math.round(range(v, TYPE) * TOTAL);
  const noise = range(v, NOISE);
  const decode = range(v, DECODE);

  const windowOpacity = useTransform(p, [0.58, 0.72], [1, 0]);
  const windowScale = useTransform(p, [0.5, 0.72], [1, 0.94]);
  const caption = useTransform(p, [0, 0.06, 0.45, 0.52], [0, 1, 1, 0]);

  // Walk the script, spending ticks
  let left = ticks;
  const shown: { line: Line; text: string; typing: boolean }[] = [];
  for (const line of SCRIPT) {
    if (left <= 0) break;
    if (line.kind === "cmd") {
      const n = Math.min(line.text.length, left);
      shown.push({ line, text: line.text.slice(0, n), typing: n < line.text.length });
    } else {
      shown.push({ line, text: line.text, typing: false });
    }
    left -= cost(line);
  }

  return (
    <section ref={ref} aria-label="Opening selected work" className="relative z-10 h-[300svh] rounded-t-[2rem] border-t border-line bg-ink md:rounded-t-[3rem]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-4 md:px-10">
        <motion.div
          style={{ opacity: windowOpacity, scale: windowScale }}
          className="relative flex h-[min(70svh,34rem)] w-full max-w-[56rem] flex-col overflow-hidden rounded-[18px] border border-line bg-ink-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] will-change-transform"
        >
          {/* Title bar */}
          <div className="flex h-10 shrink-0 items-center gap-4 border-b border-line px-4">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-fg/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg/45" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg/20" />
            </span>
            <span className="flex-1 truncate text-center font-mono text-[11px] text-fg/50">
              {scramble("zsh — sudakknqw — 80×24", noise, seed, 999)}
            </span>
            <span className="w-[42px]" />
          </div>

          {/* Output */}
          <pre className="flex-1 overflow-hidden whitespace-pre-wrap p-4 font-mono text-[11px] leading-[1.75] text-fg sm:text-[13px] md:p-6 md:text-[15px]">
            {shown.map(({ line, text, typing }, i) => (
              <div key={i} className={line.kind === "dim" ? "text-fg/45" : line.kind === "out" ? "text-fg/70" : ""}>
                {line.kind === "cmd" && (
                  <span className="mr-3 text-fg/50">{scramble(i === 0 ? "~ $" : "~/projects $", noise, seed, i * 50)}</span>
                )}
                {line.mark && (
                  <span className={`mr-2 ${line.kind === "out" ? "text-fg/40" : ""}`}>  {scramble(line.mark, noise, seed, i * 50 + 5)}</span>
                )}
                {scramble(text, noise, seed, i * 50 + 10) || " "}
                {line.extra && <span className="hidden sm:inline">{scramble(line.extra, noise, seed, i * 50 + 30)}</span>}
                {typing && <span className="ml-px inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-fg" />}
              </div>
            ))}
            {/* Idle cursor while nothing is being typed; a prompt before anything runs */}
            {!shown.some((s) => s.typing) && (
              <div>
                {shown.length === 0 && <span className="mr-3 text-fg/50">~ $</span>}
                <span className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] animate-pulse bg-fg" />
              </div>
            )}
          </pre>
        </motion.div>

        {/* The heading the noise decodes into. Each letter flickers through glyphs, then locks in place. */}
        {decode > 0 && (
          <h2
            aria-label="Selected work"
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-center font-display text-[clamp(3rem,13vw,13rem)] font-medium leading-none tracking-[-0.05em]"
          >
            {HEADING.map((c, i) => {
              if (c.ch === " ") return <span key={i}> </span>;
              // Letters lock left to right, with a little jitter so it doesn't read as a sweep
              const lock = 0.25 + 0.6 * (i / HEADING.length) + hash(i, 3) * 0.12;
              const appear = lock - 0.3;
              const visible = decode > appear;
              const locked = decode >= lock;
              return (
                <span
                  key={i}
                  aria-hidden
                  className={`inline-block ${c.serif ? "font-serif font-normal tracking-[-0.02em]" : ""} ${
                    locked ? (c.dim ? "opacity-45" : "") : "font-mono font-normal opacity-70"
                  } ${visible ? "" : "opacity-0"}`}
                >
                  {locked ? c.ch : glyph(i, seed + i)}
                </span>
              );
            })}
          </h2>
        )}

        <motion.p style={{ opacity: caption }} className="label absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          Keep scrolling ↓
        </motion.p>
      </div>
    </section>
  );
}
