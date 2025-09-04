import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase as sharedSupabase } from "@/lib/supabase";

const supabase = sharedSupabase;

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile?.onboarded) {
    redirect("/onboarding");
  }

  return <div>🎉 Welcome to your Dashboard, {profile.name}</div>;
}
