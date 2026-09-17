"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { easeExpo } from "@/lib/motion";
import { site } from "@/lib/site";
import ArrowLink from "./ArrowLink";
import ContactForm from "./ContactForm";

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

        {/* Two equal ways in: a short brief, or straight to a chat. Neither is the "main" path. */}
        <div className="mt-[4rem] grid grid-cols-12 gap-y-[3.25rem] md:mt-[5.5rem] md:gap-x-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.4, ease: easeExpo, delay: 0.1 }}
            className="col-span-12 md:col-span-7"
          >
            <h3 className="font-display text-display-s font-semibold">Tell me about your project</h3>
            <p className={`mb-[2.1rem] mt-2 text-[0.9375rem] transition-colors duration-700 ${muted}`}>
              Three quick answers become a ready message in Telegram.
            </p>
            <ContactForm inverted={active} />
          </motion.div>

          {/* "or" divider on mobile; a vertical rule does the job on desktop */}
          <div className="col-span-12 flex items-center gap-4 md:hidden" aria-hidden>
            <span className={`h-px flex-1 transition-colors duration-700 ${active ? "bg-ink/20" : "bg-line"}`} />
            <span className={`label transition-colors duration-700 ${muted}`}>or</span>
            <span className={`h-px flex-1 transition-colors duration-700 ${active ? "bg-ink/20" : "bg-line"}`} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.4, ease: easeExpo, delay: 0.2 }}
            className={`col-span-12 transition-colors duration-700 md:col-span-4 md:col-start-9 md:border-l md:pl-8 ${rule}`}
          >
            <h3 className="font-display text-display-s font-semibold">Just reach out directly</h3>
            <p className={`mb-[1.6rem] mt-2 text-[0.9375rem] transition-colors duration-700 ${muted}`}>
              Prefer to just say hi?
            </p>

            {/* One hover zone for both rows, so moving from Telegram to email keeps the colour */}
            <div onPointerEnter={on} onPointerLeave={off}>
              {[
                { href: site.telegram, label: "DM on Telegram" },
                { href: site.email, label: "Email me" },
              ].map((link) => (
                <div
                  key={link.href}
                  className={`border-t py-[1.15rem] transition-colors duration-700 last:border-b md:py-[1.4rem] ${rule}`}
                >
                  <ArrowLink href={link.href} size="ml" inverted={active} onFocus={on} onBlur={off}>
                    {link.label}
                  </ArrowLink>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Guaranteed breathing room; mt-auto below still pins the footer to the bottom when there's spare height */}
        <div aria-hidden className="h-[5.5rem] shrink-0" />
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
