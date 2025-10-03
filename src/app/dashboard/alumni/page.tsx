import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getSupabase } from '@/lib/supabase';
import { AppSidebar } from '@/components/app-sidebar';
import Alumni from '@/components/dashboard/alumni';

export default async function AlumniDashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const supabase = getSupabase();

  // Check if user profile exists and is onboarded
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile || !profile.onboarded) {
    redirect("/onboarding");
  }

  // Redirect non-alumni to their appropriate dashboard
  if (profile.role !== "alumni") {
    const dashboardPath =
      profile.role === "student"
        ? "/dashboard/student"
        : profile.role === "aspirant"
        ? "/dashboard/aspirant"
        : "/dashboard";
    redirect(dashboardPath);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar profile={profile} />
      <div className="flex-1 overflow-hidden">
        <Alumni profile={profile} />
      </div>
    </div>
  );
}
