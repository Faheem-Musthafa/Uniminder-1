import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

export default async function DashboardPage() {
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

  // Redirect to student dashboard
  if (profile.role === "student") {
    redirect("/dashboard/student");
  } else {
    // For now, redirect non-students to onboarding or show appropriate message
    redirect("/onboarding");
  }
}
