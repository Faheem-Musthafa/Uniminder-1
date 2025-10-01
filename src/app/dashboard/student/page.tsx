import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import StudentDashboard from "@/components/dashboard/student";

const supabase = getSupabase();

export default async function StudentDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile?.onboarded) {
    redirect("/onboarding");
  }

  if (profile.role !== "student") {
    redirect("/dashboard");
  }

  return <StudentDashboard profile={profile} />;
}
