import { auth } from "@clerk/nextjs/server";
// ...existing imports...
import { NextResponse } from "next/server";

import { supabase as sharedSupabase } from "@/lib/supabase";

const supabase = sharedSupabase;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { role } = await req.json();

    // Try to update an existing profile first
    const { data: existing, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    // If select returned an unexpected error, return it
    if (selectError && !existing) {
      console.error("Supabase select error:", selectError);
      // proceed assuming no existing row only if it's a not-found style error
      // but to be safe, return the error
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (existing) {
      const { error } = await supabase
        .from("profiles")
        .update({ role, onboarded: true })
        .eq("user_id", userId);

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // Insert if no profile exists yet
      const { error } = await supabase.from("profiles").insert({
        user_id: userId,
        role,
        onboarded: true,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Onboarding handler error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
