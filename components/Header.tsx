"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { site } from "@/lib/site";
import { easeExpo } from "@/lib/motion";
import UnderlineLink from "./UnderlineLink";

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.4, ease: easeExpo, delay: 0.1 }}
      // Blur stays on permanently — only colours fade, animating backdrop-filter itself stutters
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-700 ease-expo ${
        scrolled ? "border-line bg-ink/55" : "border-transparent bg-ink/0"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">
          {site.name}
          <span className="text-accent">.</span>
        </a>

        <UnderlineLink href="#contact" className="font-display text-base font-medium tracking-tight">
          Let&apos;s talk
        </UnderlineLink>
      </div>
    </motion.header>
  );
}
