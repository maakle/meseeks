import SignInViewPage from "@/features/auth/components/sign-in-view";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Authentication | Sign In",
  description: "Sign In page for authentication.",
};

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <SignInViewPage />;
}
