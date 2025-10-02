import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import StudentDashboard from "@/components/dashboard/student";
import { SidebarProvider } from "@/components/ui/sidebar";

const supabase = getSupabase();

export default async function StudentDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Check if user profile exists and is onboarded
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!profile || !profile.onboarded) {
    redirect('/onboarding');
  }

  // Redirect non-students to their appropriate dashboard
  if (profile.role !== 'student') {
    const dashboardPath = profile.role === 'alumni' ? '/dashboard/alumni' :
                         profile.role === 'aspirant' ? '/dashboard/aspirant' :
                         '/dashboard';
    redirect(dashboardPath);
  }

  if (profile.role !== "student") {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <StudentDashboard profile={profile} />
    </SidebarProvider>
  );
}
