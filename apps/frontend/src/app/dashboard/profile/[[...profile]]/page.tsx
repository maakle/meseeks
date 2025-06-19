import ProfileViewPage from "@/features/profile/components/profile-view-page";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Dashboard : Profile",
};

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();
  console.log(token);

  return <ProfileViewPage />;
}
