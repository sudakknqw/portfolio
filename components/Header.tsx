"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { easeExpo, INTRO } from "@/lib/motion";
import BracketButton from "./BracketButton";

const NAV = [
  ["Work", "#work"],
  ["Process", "#process"],
  ["Contact", "#contact"],
] as const;

/** Floating rounded bar, inset from the edges */
export default function Header() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.4, ease: easeExpo, delay: INTRO - 0.2 }}
      className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4"
    >
      <div className="shell">
        <div className="flex h-14 items-center justify-between rounded-2xl border border-line bg-ink-2/80 px-4 backdrop-blur-xl md:h-16 md:px-6">
          <a href="#top" className="flex items-center gap-2 font-display text-lg font-medium tracking-tight">
            <span aria-hidden className="font-serif text-2xl leading-none">
              ✳
            </span>
            {site.name}
          </a>

          <nav className="flex items-center gap-7 md:gap-9">
            {NAV.map(([name, href]) => (
              <a
                key={href}
                href={href}
                className="hidden font-display text-[0.8125rem] font-medium uppercase transition-opacity duration-500 hover:opacity-60 md:block"
              >
                {name}
              </a>
            ))}
            <BracketButton href="#contact" className="text-[0.8125rem]">
              Let&apos;s talk
            </BracketButton>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
