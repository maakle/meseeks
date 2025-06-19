"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="container mx-auto w-full">
      <div className="flex flex-col items-center justify-center max-w-screen-xl mx-auto py-20 md:py-32">
        <div className="text-center space-y-8 w-full">
          <Badge variant="outline" className="text-sm py-1 rounded-full">
            <span className="mr-1 text-primary">
              <Badge className="rounded-full text-xs">New</Badge>
            </span>
            <span className="text-xs"> Free for self-hosting!</span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Turn
              <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                Simple Prompts
              </span>
              Into Real-World Actions
            </h1>
          </div>

          <p className="text-xl text-muted-foreground px-0 md:px-24">
            {`Meseeks is an open-source LLM-powered platform that transforms your requests into real-world actions through WhatsApp, email, and phone calls.`}
          </p>

          <div className="flex md:flex-row items-center justify-center gap-4 mt-8">
            <Button
              asChild
              variant="default"
              className="w-full md:w-auto font-bold group/arrow bg-primary text-primary-foreground"
            >
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-full md:w-auto font-bold"
            >
              <Link
                href="https://github.com/maakle/meseeks.git"
                target="_blank"
              >
                Github respository
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
