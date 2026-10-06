"use client";

import { motion, type Variants } from "framer-motion";
import { easeExpo } from "@/lib/motion";

/**
 * Headline that assembles letter by letter.
 *
 * Markup inside `text`:
 *   \n        line break
 *   _x_       letters between underscores are set in the italic serif
 *   ~word~    dimmed letters
 *   {word}    word in the serif, wrapped in dim curly braces
 */
type Char = { ch: string; serif: boolean; dim: boolean };

function parse(text: string): Char[][][] {
  // lines → words → chars
  return text.split("\n").map((line) => {
    const words: Char[][] = [[]];
    let serif = false;
    let dim = false;
    let brace = false;
    for (const ch of line) {
      if (ch === "_") {
        serif = !serif;
      } else if (ch === "~") {
        dim = !dim;
      } else if (ch === "{") {
        words[words.length - 1].push({ ch: "{", serif: true, dim: true });
        brace = true;
      } else if (ch === "}") {
        words[words.length - 1].push({ ch: "}", serif: true, dim: true });
        brace = false;
      } else if (ch === " ") {
        words.push([]);
      } else {
        words[words.length - 1].push({ ch, serif: serif || brace, dim });
      }
    }
    return words.filter((w) => w.length);
  });
}

function plain(text: string) {
  return text.replace(/[_~{}]/g, "").replace(/\n/g, " ");
}

const char: Variants = {
  hidden: { opacity: 0, y: "0.45em", rotate: 6 },
  show: (i: number) => ({
    opacity: 1,
    y: "0em",
    rotate: 0,
    transition: { duration: 1.1, ease: easeExpo, delay: i },
  }),
};

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Per-line class, e.g. indents: ["", "md:pl-[12vw]"] */
  lineClassNames?: string[];
  /** "mount" plays on load, "view" the first time it scrolls into view */
  trigger?: "mount" | "view";
  delay?: number;
  stagger?: number;
};

export default function SplitText({
  text,
  as = "h2",
  className = "",
  lineClassNames = [],
  trigger = "view",
  delay = 0,
  stagger = 0.028,
}: Props) {
  const Tag = motion[as];
  const lines = parse(text);
  let n = 0;

  const play =
    trigger === "mount"
      ? { initial: "hidden", animate: "show" }
      : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -12% 0px" } };

  return (
    <Tag aria-label={plain(text)} className={className} {...play}>
      {lines.map((words, li) => (
        <span key={li} aria-hidden className={`block ${lineClassNames[li] ?? ""}`}>
          {words.map((word, wi) => (
            <span key={wi}>
              <span className="inline-block whitespace-nowrap">
                {word.map((c, ci) => (
                  <motion.span
                    key={ci}
                    variants={char}
                    custom={delay + n++ * stagger}
                    className={`inline-block will-change-transform ${
                      c.serif ? "font-serif font-normal tracking-[-0.02em]" : ""
                    }`}
                  >
                    {/* Dim lives on an inner span: framer owns the outer one's opacity */}
                    {c.dim ? <span className="opacity-45">{c.ch}</span> : c.ch}
                  </motion.span>
                ))}
              </span>
              {wi < words.length - 1 && " "}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
