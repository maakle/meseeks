"use client";

import {
  IconBrightness,
  IconDeviceDesktop,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitch() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const handleThemeChange = React.useCallback(
    (newTheme: string, e?: React.MouseEvent) => {
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newTheme);
        return;
      }

      // Set coordinates from the click event for view transition
      if (e) {
        root.style.setProperty("--x", `${e.clientX}px`);
        root.style.setProperty("--y", `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newTheme);
      });
    },
    [setTheme]
  );

  // Ensure component is mounted before rendering to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="secondary" size="icon" className="size-8">
        <IconBrightness className="size-4" />
        <span className="sr-only">Theme</span>
      </Button>
    );
  }

  const getCurrentThemeIcon = () => {
    if (theme === "system") {
      return <IconDeviceDesktop className="size-4" />;
    }
    return resolvedTheme === "dark" ? (
      <IconMoon className="size-4" />
    ) : (
      <IconSun className="size-4" />
    );
  };

  const getCurrentThemeText = () => {
    if (theme === "system") {
      return "System";
    }
    return resolvedTheme === "dark" ? "Dark" : "Light";
  };

  return (
    <DropdownMenu data-theme={resolvedTheme}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-8 px-3">
          {getCurrentThemeIcon()}
          <span className="ml-2">{getCurrentThemeText()}</span>
          <span className="sr-only">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={(e) => handleThemeChange("system", e)}
          className="cursor-pointer"
        >
          <IconDeviceDesktop className="mr-2 size-4" />
          System
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleThemeChange("light", e)}
          className="cursor-pointer"
        >
          <IconSun className="mr-2 size-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleThemeChange("dark", e)}
          className="cursor-pointer"
        >
          <IconMoon className="mr-2 size-4" />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
