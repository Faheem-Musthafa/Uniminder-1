import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import ProfileEditForm from "@/components/profile/profile-edit-form";

const supabase = getSupabase();

export default async function ProfilePage() {
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your information and preferences
          </p>
        </div>
        <ProfileEditForm profile={profile} />
      </div>
    </div>
  );
}