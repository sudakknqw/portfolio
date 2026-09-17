"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { easeExpo } from "@/lib/motion";

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Dark trigger for use on top of the accent colour */
  inverted?: boolean;
};

/**
 * Custom listbox instead of a native <select>, whose OS popup can't be styled.
 * Keyboard: ↑/↓ to move, Enter/Space to pick, Home/End, Esc to close, type a letter to jump.
 */
export default function Select({ label, options, value, onChange, placeholder = "Select…", inverted = false }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const openList = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  const pick = (i: number) => {
    onChange(options[i]);
    close();
  };

  // Focus the list once it's mounted so keyboard handling moves with it
  useEffect(() => {
    if (open) list.current?.focus();
  }, [open]);

  // Click anywhere else closes it
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        pick(active);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        if (e.key.length === 1) {
          const i = options.findIndex((o) => o.toLowerCase().startsWith(e.key.toLowerCase()));
          if (i >= 0) setActive(i);
        }
    }
  };

  return (
    <div ref={root} className="relative">
      <span id={`${id}-label`} className={`label mb-2 block transition-colors duration-700 ${inverted ? "text-ink/60" : ""}`}>
        {label}
      </span>

      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onTriggerKey}
        className={`flex w-full items-center justify-between border-b pb-[0.55rem] pt-1 text-left text-base outline-none transition-colors duration-500 ${
          inverted
            ? `border-ink/25 focus-visible:border-ink ${open ? "border-ink" : ""}`
            : `border-bone/20 focus-visible:border-accent ${open ? "border-accent" : ""}`
        }`}
      >
        <span
          id={`${id}-value`}
          className={`truncate transition-colors duration-700 ${
            value ? (inverted ? "text-ink" : "text-bone") : inverted ? "text-ink/45" : "text-bone/35"
          }`}
        >
          {value || placeholder}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className={`ml-3 h-3 w-3 shrink-0 transition-transform duration-500 ease-expo ${open ? "rotate-180" : ""} ${
            inverted ? "text-ink/60" : "text-bone/40"
          }`}
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={list}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={`${id}-label`}
            aria-activedescendant={`${id}-opt-${active}`}
            onKeyDown={onListKey}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: easeExpo }}
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 min-w-[11rem] overflow-hidden rounded-[0.4rem] border border-bone/15 bg-ink-2 py-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] outline-none"
          >
            {options.map((option, i) => {
              const selected = option === value;
              return (
                <li
                  key={option}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={selected}
                  onPointerMove={() => setActive(i)}
                  onClick={() => pick(i)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-[0.9375rem] transition-colors duration-200 ${
                    i === active ? "bg-bone/[0.06] text-bone" : "text-bone/70"
                  }`}
                >
                  {/* Accent tick marks the current choice */}
                  <span
                    aria-hidden
                    className={`h-px w-3 shrink-0 transition-colors duration-200 ${selected ? "bg-accent" : "bg-transparent"}`}
                  />
                  {option}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
