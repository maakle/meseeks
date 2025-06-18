import FAQ from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import Pricing from "@/components/landing/pricing";
import Testimonial from "@/components/landing/testimonial";
import { Navbar } from "@/components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    return redirect("/auth/sign-in");
  } else {
    return (
      <div>
        <Navbar />
        <Hero />
        <Features />
        <FAQ />
        <Testimonial />
        <Pricing />
        <Footer />
      </div>
    );
  }
}
