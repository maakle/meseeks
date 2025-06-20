"use client";

import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";
import Marquee from "react-fast-marquee";

interface sponsorsProps {
  icon: string;
  name: string;
}

const sponsors: sponsorsProps[] = [
  {
    icon: "Crown",
    name: "Acmebrand",
  },
  {
    icon: "Vegan",
    name: "Acmelogo",
  },
  {
    icon: "Ghost",
    name: "Acmesponsor",
  },
  {
    icon: "Puzzle",
    name: "Acmeipsum",
  },
  {
    icon: "Squirrel",
    name: "Acme",
  },
  {
    icon: "Cookie",
    name: "Accmee",
  },
  {
    icon: "Drama",
    name: "Acmetech",
  },
];

export const SponsorsSection = () => {
  return (
    <section id="sponsors" className="max-w-[75%] mx-auto pb-24 sm:pb-32 px-6">
      <h2 className="text-lg md:text-xl text-center mb-6">Trusted by</h2>

      <div className="mt-4 mx-auto">
        <Marquee
          speed={40}
          gradient={false}
          pauseOnHover={true}
          className="gap-[3rem]"
        >
          {sponsors.map(({ icon, name }) => (
            <div
              key={name}
              className="flex items-center text-xl md:text-2xl font-medium mx-8"
            >
              <Icon
                name={icon as keyof typeof icons}
                size={32}
                color="white"
                className="mr-2"
              />
              {name}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
