import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function Dashboard() {
  const { userId } = auth();
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
