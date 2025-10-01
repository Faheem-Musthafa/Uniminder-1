import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Allow partial update, do not force onboarded=true here
    const payload: Record<string, unknown> = { id: userId, updated_at: new Date().toISOString() };
    const allowed = [
      "full_name",
      "role",
      "location",
      "college",
      "degree",
      "branch",
      "passing_year",
      "company",
      "designation",
      "entrance_exam",
      "target_college",
      "linkedin",
      "skills",
      "bio",
      "years_of_experience",
      "interests",
      "looking_for",
    ];

    for (const key of allowed) {
      if (key in body) payload[key] = body[key];
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select("id, onboarded")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
