export type Project = {
  slug: string;
  title: string;
  type: string;
  year?: string;
  /** 2–3 concrete things this project demonstrates */
  points: string[];
  stack: string[];
  liveUrl?: string;
  device: "browser" | "phone";
  /** Path in /public, e.g. "/projects/baan-kaffe.jpg". Leave empty to show a placeholder. */
  image?: string;
  /** Shown in the fake address bar of the browser frame */
  domain?: string;
};

export const projects: Project[] = [
  {
    slug: "baan-kaffe",
    title: "Baan Kaffe",
    type: "Landing page for a coffee shop",
    points: [
      "The full menu in English and Thai, designed for the phone first, because that is where guests look it up",
      "Fast on a weak mobile connection: every photo is sized for the screen it lands on",
      "One tap from any screen to LINE or a phone call, so a visitor becomes a guest without searching",
    ],
    stack: ["Next.js", "React", "Tailwind CSS"],
    liveUrl: "https://baan-kaffe.vercel.app",
    device: "browser",
    image: "/projects/baan-kaffe.jpg",
    domain: "baan-kaffe.vercel.app",
  },
  {
    slug: "sharp-barber",
    title: "Sharp Barber Bangkok",
    type: "Booking system with database",
    points: [
      "Clients book online in a few taps; every booking is checked on the server, so broken data never reaches the database",
      "Customer data is locked down: the database is closed to the outside, and bookings get in only through one secured endpoint",
      "The owner gets a Telegram message the moment someone books, with no admin panel to check",
    ],
    stack: ["Next.js", "Supabase", "Telegram Bot API"],
    liveUrl: "https://sharpbarber.vercel.app/",
    device: "browser",
    image: "/projects/sharp-barber.jpg",
    domain: "sharpbarber.vercel.app",
  },
  {
    slug: "flowlane",
    title: "Flowlane",
    type: "SaaS landing page with interactive product demo",
    points: [
      "A working product demo instead of screenshots: a task board with drag-style cards and team workload, so visitors try the product before signing up",
      "A built-in assistant chat that answers questions right on the page",
      "A waitlist form that catches mistakes as you type and handles every outcome, so no sign-up is lost",
    ],
    stack: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://flowlane-promo.vercel.app",
    device: "browser",
    image: "/projects/flowlane.jpg",
    domain: "flowlane-promo.vercel.app",
  },
];
