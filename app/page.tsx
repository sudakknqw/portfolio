import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowIWork from "@/components/HowIWork";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work />
        <HowIWork />
        <Contact />
      </main>
    </>
  );
}
