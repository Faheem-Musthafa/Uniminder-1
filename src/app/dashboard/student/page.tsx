import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import StudentDashboard from "@/components/dashboard/student";
import { AppSidebar } from "@/components/app-sidebar";

export default async function StudentDashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const supabase = getSupabase();

  // Check if user profile exists and is onboarded
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.onboarded) {
    redirect("/onboarding");
  }

  // Redirect non-students to their appropriate dashboard
  if (profile.role !== "student") {
    const dashboardPath =
      profile.role === "alumni"
        ? "/dashboard/alumni"
        : profile.role === "aspirant"
        ? "/dashboard/aspirant"
        : "/dashboard";
    redirect(dashboardPath);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar profile={profile} />
      <div className="flex-1 overflow-hidden">
        <StudentDashboard profile={profile} />
      </div>
    </div>
  );
}
