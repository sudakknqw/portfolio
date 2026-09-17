"use client";

import { motion } from "framer-motion";
import { easeExpo } from "@/lib/motion";

const steps = [
  {
    title: "Architecture before components",
    text: "Data model, API boundaries and auth flow get mapped out before the first screen. New features later land as a migration instead of a rewrite.",
  },
  {
    title: "Secure from the first commit",
    text: "Row-level security, server-side validation, secrets kept on the server. They go in on day one, while they're still cheap to get right.",
  },
  {
    title: "Honest scope",
    text: "You get a written list of what's included, what isn't and where the risks are. If something turns out bigger than it looked, I say so before building it.",
  },
  {
    title: "Code worth handing off",
    text: "Typed end to end, consistent structure, a README that actually helps. Another developer can pick up the repo without a call.",
  },
];

export default function HowIWork() {
  return (
    <section id="process" className="relative border-t border-line pb-32 pt-[6.5rem] md:pb-[12rem] md:pt-[10rem]">
      <div className="shell grid grid-cols-12 gap-y-14 md:gap-x-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.4, ease: easeExpo }}
          className="col-span-12 self-start md:sticky md:top-32 md:col-span-4"
        >
          <p className="label mb-[1.4rem]">
            <span className="text-accent">02</span> / Process
          </p>
          <h2 className="font-display text-display-l">
            <span className="block font-extralight">How I</span>
            <span className="block font-bold">work</span>
          </h2>
        </motion.div>

        <ol className="col-span-12 md:col-span-8 md:col-start-5">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.4, ease: easeExpo, delay: i * 0.08 }}
              className="group/step grid grid-cols-[3.75rem_1fr] items-baseline gap-x-5 border-b border-line pb-[2.4rem] pt-[2.1rem] first:border-t md:grid-cols-[10rem_1fr] md:gap-x-10 md:pb-[3.4rem] md:pt-[2.75rem]"
            >
              <span className="relative origin-left font-display text-[clamp(2.5rem,6vw,5.5rem)] font-extralight leading-none tracking-[-0.05em] text-bone/35 transition-transform duration-700 ease-expo group-hover/step:scale-[1.18]">
                {String(i + 1).padStart(2, "0")}
                {/* Colour change as a cross-fade: opacity is composited, animating `color` repaints the glyphs */}
                <span
                  aria-hidden
                  className="absolute inset-0 text-accent opacity-0 transition-opacity duration-700 ease-expo group-hover/step:opacity-100"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <div>
                <h3 className="font-display text-display-s font-semibold">{step.title}</h3>
                <p className="mt-[0.7rem] max-w-[34rem] text-lead text-bone/65">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
