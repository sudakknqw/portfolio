"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { easeExpo } from "@/lib/motion";
import { site } from "@/lib/site";
import ArrowLink from "./ArrowLink";
import ContactForm from "./ContactForm";
import SplitText from "./SplitText";

/** Current time at GMT+7, ticking. Rendered only after mount so server and client markup match. */
function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date(Date.now() + 7 * 3600_000);
      setTime(`${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`);
    };
    tick();
    const t = window.setInterval(tick, 10_000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <span className="tabular-nums">
      {time || "--:--"} GMT +7
    </span>
  );
}

/** The closing line: one giant question across the full width, rising into place as the page ends. */
function Finale() {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["35%", "0%"]);

  return (
    <motion.a
      ref={ref}
      href={site.telegram}
      target="_blank"
      rel="noreferrer"
      data-cursor-label="Let's go"
      style={{ y }}
      className="block py-[4vw]"
    >
      <SplitText
        as="p"
        text="Work {together}?"
        stagger={0.035}
        className="whitespace-nowrap text-center font-display text-[clamp(2.6rem,13.8vw,17rem)] font-medium leading-[0.9] tracking-[-0.06em]"
      />
    </motion.a>
  );
}

export default function Contact() {
  // Hovering either contact link floods the whole block with the accent colour
  const [active, setActive] = useState(false);
  const on = () => setActive(true);
  const off = () => setActive(false);

  const ink = active ? "text-ink" : "text-fg";
  const muted = active ? "text-ink/60" : "text-muted";
  const rule = active ? "border-ink/20" : "border-line";

  return (
    <section
      id="contact"
      data-cursor={active ? "invert" : undefined}
      className="relative z-10 flex min-h-[100svh] flex-col overflow-hidden rounded-t-[2rem] border-t border-line bg-ink md:rounded-t-[3rem]"
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
        className={`shell relative flex flex-1 flex-col pb-7 pt-24 transition-colors duration-700 ease-expo md:pb-9 md:pt-36 ${ink}`}
      >
        <p className={`label mb-6 transition-colors duration-700 ${muted}`}>[ 04 ] Contact</p>

        <div className="grid grid-cols-12 gap-y-14 md:gap-x-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.4, ease: easeExpo }}
            className="col-span-12 md:col-span-7"
          >
            <h2 className="mb-10 font-display text-display-m font-medium md:mb-14">
              Tell me what you need. <span className="font-serif font-normal">One line is enough.</span>
            </h2>
            <ContactForm inverted={active} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.4, ease: easeExpo, delay: 0.15 }}
            className="col-span-12 self-end md:col-span-4 md:col-start-9"
          >
            <p className={`label mb-4 transition-colors duration-700 ${muted}`}>Or reach out directly</p>
            {/* One hover zone for both rows, so moving from Telegram to email keeps the colour */}
            <div onPointerEnter={on} onPointerLeave={off}>
              {[
                { href: site.telegram, label: "Telegram" },
                { href: site.email, label: "Email" },
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

        <div className="mt-auto pt-20 md:pt-28">
          <Finale />
        </div>

        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t pt-[1.15rem] transition-colors duration-700 ${rule}`}
        >
          <span className={`label font-medium transition-colors duration-700 ${muted}`}>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span className={`label font-medium transition-colors duration-700 ${muted}`}>
            <Clock />
          </span>
          <a href="#top" className={`label font-medium transition-colors duration-700 hover:text-fg ${muted}`}>
            Back to top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
