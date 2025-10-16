import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/supabase";
import SettingsModal from "@/components/settings/settings";

export const metadata = {
  title: "Settings | UniMinder",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user profile
  const profile = await db.profiles.findByUserId(userId);

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SettingsModal profile={profile} />
    </div>
  );
}
