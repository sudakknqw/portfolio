type Common = {
  children: string;
  /** Dark text for use on top of the accent colour */
  inverted?: boolean;
  className?: string;
};

type LinkProps = Common &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className"> & { href: string };

type ButtonProps = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & { href?: undefined };

/**
 * "[ Let's talk ]" — on hover the label lifts out and a ticker of itself runs through the brackets.
 * Without `href` it renders a <button> (e.g. a form's submit).
 */
export default function BracketButton(props: LinkProps | ButtonProps) {
  const { children, inverted = false, className = "", ...rest } = props;
  const classes = `group/br inline-flex items-center gap-[0.5em] font-display font-medium uppercase leading-none tracking-[0.01em] transition-colors duration-500 ${
    inverted ? "text-ink" : "text-fg"
  } ${className}`;

  const inner = (
    <>
      <span aria-hidden className="font-serif text-[1.25em] font-normal normal-case">
        [
      </span>
      <span className="relative block overflow-hidden py-[0.2em]">
        {/* Resting label: also sets the width the ticker runs inside */}
        <span className="block transition-transform duration-500 ease-expo group-hover/br:-translate-y-[130%] group-focus-visible/br:-translate-y-[130%]">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-x-0 top-[0.2em] block translate-y-[130%] transition-transform duration-500 ease-expo group-hover/br:translate-y-0 group-focus-visible/br:translate-y-0"
        >
          <span className="flex w-max animate-marquee whitespace-nowrap [animation-play-state:paused] group-hover/br:[animation-play-state:running]">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="pr-[0.6em]">
                {children}
              </span>
            ))}
          </span>
        </span>
      </span>
      <span aria-hidden className="font-serif text-[1.25em] font-normal normal-case">
        ]
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
