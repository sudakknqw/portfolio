import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowIWork from "@/components/HowIWork";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work />
        <HowIWork />
        <div className="relative z-10 bg-ink pb-24 md:pb-36">
          <Marquee items={["Landing pages", "Booking systems", "Integrations", "Automation"]} />
        </div>
        <Contact />
      </main>
    </>
  );
}
