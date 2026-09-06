import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { LokerFilterWidget } from "@/components/landing/LokerFilterWidget";
import { TrustBar } from "@/components/landing/TrustBar";
import { Stats } from "@/components/landing/Stats";
import { Services } from "@/components/landing/Services";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { FAQ } from "@/components/landing/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LokerFilterWidget />
        <TrustBar />
        <Stats />
        <Services />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
