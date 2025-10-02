import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import AlumniDashboard from "@/components/dashboard/alumni";
import { SidebarProvider } from "@/components/ui/sidebar";

const supabase = getSupabase();

export default async function AlumniDashboardPage() {
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

  if (profile.role !== "alumni") {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <AlumniDashboard profile={profile} />
    </SidebarProvider>
  );
}
