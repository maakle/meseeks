import { ThemeSwitch } from "@/components/layout/ThemeToggle/theme-switch";
import { ThemeSelector } from "@/components/theme-selector";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export const metadata = {
  title: "Dashboard : Settings",
};

export default async function Page() {
  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-2xl px-6">
        <Heading title="Settings" description="Manage your settings" />

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Color Mode</div>
            <div className="flex gap-2">
              <ThemeSwitch />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Theme</div>
            <div className="flex gap-2">
              <ThemeSelector />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
