import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const supabase = getSupabase();
  
  // Check if user profile exists and is onboarded
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.onboarded) {
    redirect('/onboarding');
  }

  // Redirect to appropriate dashboard based on role
  if (profile.role === 'student') {
    redirect('/dashboard/student');
  } else if (profile.role === 'alumni') {
    redirect('/dashboard/alumni');
  } else if (profile.role === 'aspirant') {
    redirect('/dashboard/aspirant');
  }

  // Default dashboard for unknown roles
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to UniMinder!</h1>
        <p className="text-muted-foreground mb-6">Setting up your dashboard...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
