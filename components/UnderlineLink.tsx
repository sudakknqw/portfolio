type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode };

/** Text link with a faint resting underline; accent line draws left → right on hover. */
export default function UnderlineLink({ children, className = "", ...rest }: Props) {
  return (
    <a {...rest} className={`group/link relative inline-block pb-1 ${className}`}>
      {children}
      <span aria-hidden className="absolute bottom-0 left-0 h-px w-full bg-bone/25" />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-700 ease-expo group-hover/link:origin-left group-hover/link:scale-x-100"
      />
    </a>
  );
}
