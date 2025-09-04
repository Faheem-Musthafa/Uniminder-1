import { auth } from "@clerk/nextjs/server";
// ...existing imports...
import { NextResponse } from "next/server";

import { supabase as sharedSupabase } from "@/lib/supabase";

const supabase = sharedSupabase;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await req.json();

  // Try to update an existing profile first
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("profiles")
      .update({ role, onboarded: true })
      .eq("user_id", userId);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    // Insert if no profile exists yet
    const { error } = await supabase.from("profiles").insert({
      user_id: userId,
      role,
      onboarded: true,
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
