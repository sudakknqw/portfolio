"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

// The heading repeats, each copy fainter, sliding at its own pace
const ECHOES = [
  { opacity: 1, from: "0%" },
  { opacity: 0.5, from: "-6%" },
  { opacity: 0.25, from: "8%" },
  { opacity: 0.1, from: "-10%" },
];

function Echo({ i, progress }: { i: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const e = ECHOES[i];
  const x = useTransform(progress, [0, 1], [e.from, "0%"]);
  return (
    <motion.span aria-hidden={i > 0} style={{ x, opacity: e.opacity }} className="block whitespace-nowrap">
      How I <span className="font-serif">work</span>
    </motion.span>
  );
}

export default function HowIWork() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });

  return (
    <section id="process" className="relative z-10 bg-ink pb-24 pt-24 md:pb-40 md:pt-40">
      <div ref={ref} className="shell grid grid-cols-12 gap-y-10 overflow-hidden md:gap-x-8">
        <div className="col-span-12 md:col-span-8">
          <p className="label mb-6">[ 02 ] Process</p>
          <h2 className="font-display text-display-xl font-medium">
            {ECHOES.map((_, i) => (
              <Echo key={i} i={i} progress={scrollYProgress} />
            ))}
          </h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.4, ease: easeExpo }}
          className="caps col-span-12 max-w-[26rem] self-end md:col-span-4"
        >
          Four rules every project follows, from a one-page landing to a booking system with a database. None of them
          are extras you pay for later.
        </motion.p>
      </div>

      <div className="shell mt-14 md:mt-24">
        <ol className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.4, ease: easeExpo, delay: i * 0.08 }}
              className="panel group/step flex min-h-[17rem] flex-col p-6 transition-colors duration-700 ease-expo hover:bg-fg md:min-h-[20rem] md:p-8"
            >
              <span className="font-serif text-[clamp(2.5rem,4.5vw,4rem)] leading-none transition-colors duration-700 group-hover/step:text-ink">
                {`{${String(i + 1).padStart(2, "0")}}`}
              </span>
              <h3 className="mt-auto pt-10 font-display text-display-s font-medium transition-colors duration-700 group-hover/step:text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg/70 transition-colors duration-700 group-hover/step:text-ink/75">
                {step.text}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
