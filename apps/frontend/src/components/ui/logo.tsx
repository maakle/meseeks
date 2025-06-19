"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  themeOverride?: "light" | "dark" | "auto";
}

export const Logo = ({
  width = 40,
  height = 40,
  className = "mr-2",
  priority = true,
  themeOverride = "auto",
}: LogoProps) => {
  const { resolvedTheme } = useTheme();

  // Determine which theme to use for logo selection
  const effectiveTheme =
    themeOverride === "auto" ? resolvedTheme : themeOverride;

  // Use white logo for dark theme, black logo for light theme
  const logoSrc =
    effectiveTheme === "dark"
      ? "/assets/meseeks-logo-white.png"
      : "/assets/meseeks-logo-black.png";

  return (
    <Image
      src={logoSrc}
      alt="Meseeks"
      width={width}
      height={height}
      priority={priority}
      loading="eager"
      className={className}
    />
  );
};
