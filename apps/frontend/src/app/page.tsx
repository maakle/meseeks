import { BenefitsSection } from "@/components/landing/benefits";
import { CommunitySection } from "@/components/landing/community";
import { ContactSection } from "@/components/landing/contact";
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
      <CommunitySection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
