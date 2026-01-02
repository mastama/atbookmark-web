import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PainPoints } from "@/components/landing/PainPoints";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SocialProof } from "@/components/landing/SocialProof";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground selection:bg-secondary selection:text-foreground">
      <Navbar />
      <Hero />
      <PainPoints />
      <Features />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
