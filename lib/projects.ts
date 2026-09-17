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
      "Mobile-first one-page site with the full menu, in English and Thai",
      "Images served through next/image with properly set breakpoints",
      "LINE and tap-to-call built into the header",
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
      "Booking form validated on the server",
      "Row Level Security keeps the table fully closed from outside; bookings go in only through a server endpoint with the service role key",
      "Automatic Telegram notification to the owner for every new booking",
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
      "Working task board mockup with drag-style cards and workload distribution across the team",
      "Built-in assistant chat widget",
      "Waitlist form with full front-end validation and success and error states",
    ],
    stack: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://flowlane-promo.vercel.app",
    device: "browser",
    image: "/projects/flowlane.jpg",
    domain: "flowlane-promo.vercel.app",
  },
];
