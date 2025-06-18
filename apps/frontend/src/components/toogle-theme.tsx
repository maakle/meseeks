"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button size="sm" variant="ghost" className="justify-start mr-2">
        <div className="flex items-center gap-2">
          <span className="size-5" />
        </div>
        <span className="sr-only">Change theme</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size="sm"
      variant="ghost"
      className="justify-start mr-2"
    >
      <div className="flex items-center gap-2">
        {theme === "light" ? (
          <Moon className="size-4" />
        ) : (
          <Sun className="size-4" />
        )}
        <span className="block lg:hidden">
          {theme === "light" ? "Light" : "Dark"}
        </span>
      </div>
      <span className="sr-only">Change theme</span>
    </Button>
  );
};
