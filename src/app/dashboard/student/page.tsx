// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { getSupabase } from "@/lib/supabase";
import StudentDashboard from "@/components/dashboard/student";
import { AppSidebar } from "@/components/app-sidebar";
import { Profile } from "@/types";
import { SettingsProvider } from "@/hooks/use-settings";
import SettingsModal from "@/components/settings/settings";

export default async function StudentDashboardPage() {
  // const user = await currentUser();

  // if (!user) {
  //   redirect("/sign-in");
  // }

  // const supabase = getSupabase();

  // // Check if user profile exists and is onboarded
  // const { data: profile } = await supabase
  //   .from("profiles")
  //   .select("*")
  //   .eq("user_id", user.id)
  //   .single();

  // if (!profile || !profile.onboarded) {
  //   redirect("/onboarding");
  // }

  // // Redirect non-students to their appropriate dashboard
  // if (profile.role !== "student") {
  //   const dashboardPath =
  //     profile.role === "alumni"
  //       ? "/dashboard/alumni"
  //       : profile.role === "aspirant"
  //       ? "/dashboard/aspirant"
  //       : "/dashboard";
  //   redirect(dashboardPath);
  // }

  // DEVELOPMENT ONLY: Mock profile data for UI testing
  // Remove this when uncommenting the real authentication code above
  const profile: Profile = {
    id: "dev-user-123",
    user_id: "dev-user-123",
    email: "student@uniminder.dev",
    role: "student",
    full_name: "John Doe",
    avatar_url: undefined,
    location: "Mumbai, India",
    college: "Indian Institute of Technology, Mumbai",
    degree: "Bachelor of Technology",
    branch: "Computer Science",
    passing_year: "2026",
    linkedin: "https://linkedin.com/in/johndoe",
    skills: ["React", "TypeScript", "Python", "Data Structures"],
    bio: "Computer Science student passionate about web development and AI.",
    interests: ["Web Development", "Machine Learning", "Open Source"],
    looking_for: ["Internships", "Projects", "Mentorship"],
    onboarded: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <SettingsProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <AppSidebar profile={profile} />
        <div className="flex-1 overflow-hidden lg:ml-0">
          <StudentDashboard profile={profile} />
        </div>
        <SettingsModal profile={profile} />
      </div>
    </SettingsProvider>
  );
}
