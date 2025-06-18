import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Icon = ({
  name,
  color,
  size,
  className,
}: {
  name: keyof typeof LucideIcons;
  color: string;
  size: number;
  className?: string;
}) => {
  const IconComponent = LucideIcons[name] as LucideIcon;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }

  return <IconComponent color={color} size={size} className={className} />;
};
