type Common = {
  children: React.ReactNode;
  /** "md" — project cards; "ml" — contact options; "lg" — display-sized links */
  size?: "md" | "ml" | "lg";
  /** Dark underline/arrow for use on top of the accent colour */
  inverted?: boolean;
  className?: string;
};

type LinkProps = Common &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className"> & { href: string };

/** Without `href` it renders a <button> with the same look (e.g. a form's submit) */
type ButtonProps = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & { href?: undefined };

function Arrow({ className = "", strokeWidth }: { className?: string; strokeWidth: number }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

const sizes = {
  md: {
    link: "gap-2 text-lg font-medium md:text-xl",
    text: "pb-0.5",
    line: "h-px",
    arrow: "h-4 w-4 md:h-5 md:w-5",
    stroke: 1.5,
  },
  ml: {
    link: "gap-[0.35em] text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-none",
    text: "pb-[0.14em]",
    line: "h-px",
    arrow: "h-[0.6em] w-[0.6em]",
    stroke: 1.3,
  },
  lg: {
    link: "gap-[0.3em] text-[clamp(1.75rem,5.6vw,5rem)] font-medium leading-none",
    text: "pb-[0.12em]",
    line: "h-[2px]",
    arrow: "h-[0.62em] w-[0.62em]",
    stroke: 1.1,
  },
};

/** "View live ↗" — arrow exits top-right and a fresh one slides in from bottom-left. */
export default function ArrowLink(props: LinkProps | ButtonProps) {
  const { children, size = "md", inverted = false, className = "", ...rest } = props;
  const s = sizes[size];
  const classes = `group/link inline-flex items-center font-display tracking-tight ${s.link} ${className}`;

  const inner = (
    <>
      <span className={`relative ${s.text}`}>
        {children}
        <span
          aria-hidden
          className={`absolute bottom-0 left-0 w-full origin-right scale-x-0 transition-transform duration-700 ease-expo group-hover/link:origin-left group-hover/link:scale-x-100 group-focus-visible/link:origin-left group-focus-visible/link:scale-x-100 ${s.line} ${
            inverted ? "bg-ink" : "bg-accent"
          }`}
        />
      </span>
      <span
        className={`relative block overflow-hidden transition-colors duration-700 ${s.arrow} ${
          inverted ? "text-ink" : "text-accent"
        }`}
      >
        <Arrow
          strokeWidth={s.stroke}
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-expo group-hover/link:-translate-y-full group-hover/link:translate-x-full"
        />
        <Arrow
          strokeWidth={s.stroke}
          className="absolute inset-0 h-full w-full -translate-x-full translate-y-full transition-transform duration-700 ease-expo group-hover/link:translate-x-0 group-hover/link:translate-y-0"
        />
      </span>
    </>
  );

  if (props.href === undefined) {
    const { href: _href, ...buttonRest } = rest as ButtonProps;
    return (
      <button type="button" {...buttonRest} className={classes}>
        {inner}
      </button>
    );
  }

  const { href, ...linkRest } = rest as LinkProps;
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...linkRest} className={classes}>
      {inner}
    </a>
  );
}
