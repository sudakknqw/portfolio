"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { easeExpo } from "@/lib/motion";
import SplitText from "./SplitText";

const faq = [
  {
    q: "How much does it cost?",
    a: "Projects start at $300. After a short brief you get a fixed price for the whole thing, so there are no surprises on the invoice.",
  },
  {
    q: "How does payment work?",
    a: "50% before work starts, 50% when the site goes live.",
  },
  {
    q: "How long does it take?",
    a: "A landing page takes from 3 days. A site with a database or online booking takes from 2 weeks. You get an exact date with the price.",
  },
  {
    q: "How many revisions are included?",
    a: "Two rounds of revisions are included in the price. Anything beyond that we agree on separately.",
  },
  {
    q: "Who owns the code and the hosting?",
    a: "The site runs on hosting in your account. The source code lives in my GitHub, so I can keep fixing and improving it for you.",
  },
  {
    q: "What happens after launch?",
    a: "For 14 days after launch I fix any bugs for free. After that, support is available by the hour or on a monthly plan.",
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className="border-b border-line first:border-t">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group/q flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
        >
          <span className="font-display text-display-s font-medium transition-opacity duration-500 group-hover/q:opacity-70">
            {q}
          </span>
          {/* Plus turns into a cross */}
          <span
            aria-hidden
            className={`relative block h-4 w-4 shrink-0 transition-transform duration-500 ease-expo ${open ? "rotate-45" : ""}`}
          >
            <span className="absolute left-0 top-1/2 h-px w-full bg-fg" />
            <span className="absolute left-1/2 top-0 h-full w-px bg-fg" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: easeExpo }}
            className="overflow-hidden"
          >
            <p className="max-w-[40rem] pb-7 text-[0.9375rem] leading-relaxed text-fg/75 md:text-base">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative z-10 bg-ink pb-24 md:pb-40">
      <div className="shell grid grid-cols-12 gap-y-12 md:gap-x-8">
        <div className="col-span-12 md:col-span-4">
          <p className="label mb-6">[ 03 ] FAQ</p>
          <SplitText text={"Good to\n{know}"} className="font-display text-display-l font-medium md:sticky md:top-32" />
        </div>
        <ul className="col-span-12 md:col-span-8">
          {faq.map((item, i) => (
            <Item key={item.q} {...item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
