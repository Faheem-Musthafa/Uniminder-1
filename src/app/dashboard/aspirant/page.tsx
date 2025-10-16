import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import AspirantDashboard from "@/components/dashboard/aspirant";
import { AppSidebar } from "@/components/app-sidebar";
import { SettingsProvider } from '@/hooks/use-settings';
import SettingsModal from '@/components/settings/settings';

export default async function AspirantDashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const supabase = getSupabase();

  // Check if user profile exists and is onboarded
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile || !profile.onboarded) {
    redirect("/onboarding");
  }

  // Redirect non-aspirants to their appropriate dashboard
  if (profile.role !== "aspirant") {
    const dashboardPath =
      profile.role === "alumni"
        ? "/dashboard/alumni"
        : profile.role === "student"
        ? "/dashboard/student"
        : "/dashboard";
    redirect(dashboardPath);
  }

  return (
    <SettingsProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <AppSidebar profile={profile} />
        <div className="flex-1 overflow-hidden lg:ml-0">
          <AspirantDashboard profile={profile} />
        </div>
        <SettingsModal profile={profile} />
      </div>
    </SettingsProvider>
  );
}
