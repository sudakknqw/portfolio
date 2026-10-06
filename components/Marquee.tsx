"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Band of giant words that drifts on its own and speeds up (or reverses) with scroll speed. */
export default function Marquee({ items, speed = 2.5 }: { items: string[]; speed?: number }) {
  const reduced = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const b = boost.get();
    if (b < 0) dir.current = 1;
    else if (b > 0) dir.current = -1;
    let move = dir.current * speed * (delta / 1000);
    move += move * Math.abs(b);
    base.set(base.get() + move);
  });

  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-[0.35em]">{item}</span>
          <span aria-hidden className="font-serif text-[0.6em]">
            ✳
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div aria-label={items.join(", ")} className="overflow-hidden border-y border-line py-6 md:py-9">
      <motion.div
        aria-hidden
        style={{ x }}
        className="flex w-max whitespace-nowrap font-display text-[clamp(2.5rem,7vw,6.5rem)] font-medium uppercase leading-none tracking-[-0.04em]"
      >
        {row}
        {row}
      </motion.div>
    </div>
  );
}
