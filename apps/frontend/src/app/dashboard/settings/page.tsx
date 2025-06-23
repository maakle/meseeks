import NavigationBar, { NavItem } from "@/components/ui/navigation-bar";
import { ApiKeysManagement } from "@/features/settings/components/api-keys-management";

export const metadata = {
  title: "Dashboard : Settings",
};

const navItems: NavItem[] = [
  { id: "api-keys", label: "API Keys", href: "/dashboard/settings" },
];

export default async function Page() {
  return (
    <>
      <NavigationBar items={navItems} defaultActiveId="api-keys" />
      <div className="p-8 flex flex-col gap-8">
        <ApiKeysManagement />
      </div>
    </>
  );
}
