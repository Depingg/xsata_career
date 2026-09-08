import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Stats } from "@/components/landing/Stats";
import { Services } from "@/components/landing/Services";
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <TrustBar />
        <Stats />
      </main>
      <Footer />
    </>
  );
}
