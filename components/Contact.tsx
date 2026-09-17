"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { easeExpo } from "@/lib/motion";
import { site } from "@/lib/site";
import ArrowLink from "./ArrowLink";

export default function Contact() {
  // Hovering either contact link floods the whole block with the accent colour
  const [active, setActive] = useState(false);
  const on = () => setActive(true);
  const off = () => setActive(false);

  const ink = active ? "text-ink" : "text-bone";
  const muted = active ? "text-ink/60" : "text-muted";
  const rule = active ? "border-ink/20" : "border-line";

  return (
    <section
      id="contact"
      data-cursor={active ? "invert" : undefined}
      className="relative flex min-h-[100svh] flex-col overflow-hidden border-t border-line"
    >
      <motion.div
        aria-hidden
        initial={false}
        // Solid fill, so scaling from the bottom looks identical to a clip reveal but runs on the GPU
        animate={{ scaleY: active ? 1 : 0 }}
        transition={{ duration: 0.9, ease: easeExpo }}
        style={{ originY: 1 }}
        className="absolute inset-0 bg-accent will-change-transform"
      />

      <div
        className={`shell relative flex flex-1 flex-col pb-7 pt-[6.5rem] transition-colors duration-700 ease-expo md:pb-[2.35rem] md:pt-[9rem] ${ink}`}
      >
        <p className={`label mb-[1.4rem] transition-colors duration-700 ${muted}`}>
          <span className={active ? "text-ink" : "text-accent"}>03</span> / Contact
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.4, ease: easeExpo }}
          className="font-display text-display-xl"
        >
          <span className="block font-extralight">Got a project?</span>
          <span className="block font-bold md:pl-[16vw]">Let&apos;s build it.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.4, ease: easeExpo, delay: 0.15 }}
          // The whole band of both rows is one hover zone, so moving from Telegram to email keeps the colour
          onPointerEnter={on}
          onPointerLeave={off}
          className="mt-[3.5rem] md:mt-[5rem] md:pl-[16vw]"
        >
          {/* Two equal rows — neither channel is the "main" one */}
          {[
            { href: site.telegram, label: "Message on Telegram" },
            { href: site.email, label: "Send an email" },
          ].map((link) => (
            <div
              key={link.href}
              className={`border-t py-[1.35rem] transition-colors duration-700 last:border-b md:py-[1.9rem] ${rule}`}
            >
              <ArrowLink
                href={link.href}
                size="lg"
                inverted={active}
                onFocus={on}
                onBlur={off}
              >
                {link.label}
              </ArrowLink>
            </div>
          ))}
        </motion.div>

        <div
          className={`mt-auto flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t pt-[1.15rem] transition-colors duration-700 ${rule}`}
        >
          <span className={`label font-medium transition-colors duration-700 ${muted}`}>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span className={`label hidden font-medium transition-colors duration-700 md:block ${muted}`}>{site.role}</span>
          <a href="#top" className={`label font-medium transition-colors duration-700 hover:text-bone ${muted}`}>
            Back to top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
