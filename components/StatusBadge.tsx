import { STATUS } from "@/lib/status";

// Indicator colours: green when open, amber when booked
const DOT = { available: "#4ADE80", busy: "#E0A42B" };

/**
 * Availability line under the hero: pulsing dot · status | reply time · location.
 * One line on desktop, two on mobile. All text comes from lib/status.ts.
 */
export default function StatusBadge() {
  const { available, message, location, responseTime } = STATUS;
  const details = [responseTime, location].filter(Boolean).join(" · ");
  const dot = available ? DOT.available : DOT.busy;

  return (
    <div role="status" className="inline-flex items-start gap-3.5 md:items-center">
      <span className="relative mt-[0.4rem] flex h-2.5 w-2.5 shrink-0 md:mt-0">
        {available && (
          <span aria-hidden className="status-pulse absolute inset-0 rounded-full" style={{ backgroundColor: dot }} />
        )}
        <span aria-hidden className="relative h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dot }} />
      </span>

      <span className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
        <span className="text-[0.9375rem] font-medium leading-snug text-bone">{message}</span>
        {details && (
          <>
            <span aria-hidden className="hidden h-3.5 w-px bg-bone/25 md:block" />
            <span className="text-[0.875rem] leading-snug text-bone/70">{details}</span>
          </>
        )}
      </span>
    </div>
  );
}
