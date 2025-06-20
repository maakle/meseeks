import { BenefitsSection } from "@/components/landing/benefits";
import { FAQSection } from "@/components/landing/faq";
import { FeaturesSection } from "@/components/landing/features";
import { FooterSection } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero";
import { PricingSection } from "@/components/landing/pricing";
import { ServicesSection } from "@/components/landing/services";
import { SponsorsSection } from "@/components/landing/sponsors";
import { TestimonialSection } from "@/components/landing/testimonial";
import { Navbar } from "@/components/navbar";

export default async function Page() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
