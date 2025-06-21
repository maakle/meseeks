"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NavigationBarProps {
  items: NavItem[];
  defaultActiveId?: string;
  className?: string;
  onTabChange?: (id: string) => void;
  variant?: "default" | "subtle";
}

export default function NavigationBar({
  items,
  defaultActiveId,
  className,
  onTabChange,
  variant = "default",
}: NavigationBarProps) {
  const [activeTab, setActiveTab] = useState(
    defaultActiveId || items[0]?.id || ""
  );

  const handleTabClick = (item: NavItem) => {
    setActiveTab(item.id);
    onTabChange?.(item.id);
    item.onClick?.();
  };

  const baseStyles = cn(
    "border-b",
    variant === "default"
      ? "border-border bg-transparent"
      : "bg-transparent border-border/50"
  );

  const buttonStyles = cn(
    "relative py-3 px-4 text-sm font-medium transition-all duration-200 rounded-md",
    "hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
    "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "mb-0.5"
  );

  return (
    <div className={cn(baseStyles, className)}>
      <nav className="flex items-center space-x-8 px-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item)}
            className={cn(
              buttonStyles,
              activeTab === item.id
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
            {activeTab === item.id && (
              <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
