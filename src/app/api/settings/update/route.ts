import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      full_name,
      bio,
      location,
      linkedin,
      email_notifications,
      push_notifications,
      profile_public,
      show_email,
    } = body;

    const supabase = getSupabase();

    // Build preferences object
    const preferences = {
      notifications: {
        email: email_notifications,
        push: push_notifications,
      },
    };

    // Build privacy settings object
    const privacy_settings = {
      profile_visibility: profile_public ? "public" : "private",
      show_email: show_email,
    };

    // Update profile with all settings
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name,
        bio,
        location,
        linkedin,
        preferences,
        privacy_settings,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("[API] Error updating settings:", error);
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[API] Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
