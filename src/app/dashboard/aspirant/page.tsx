import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Aspirant } from "@/components/dashboard/aspirant";

const supabase = getSupabase();

export default async function AspirantDashboardPage() {
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

  if (profile.role !== "aspirant") {
    redirect("/dashboard");
  }

  return <Aspirant profile={profile} />;
}
