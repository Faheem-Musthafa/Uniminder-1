import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { role } = await req.json();

    // Validate role
    const allowed = ["student", "alumni", "aspirant"];
    if (!allowed.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Use upsert to create or update in a single call
    const payload = {
      user_id: userId,
      role,
      onboarded: true,
    } as Record<string, unknown>;

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      const debug = process.env.DEBUG_ONBOARDING === "true";
      return NextResponse.json(
        debug
          ? { error: upsertError.message, details: upsertError }
          : { error: upsertError.message },
        { status: 500 }
      );
    }

    // Fetch the upserted row for confirmation
    const { data: row, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Supabase fetch after upsert error:", fetchError);
      const debug = process.env.DEBUG_ONBOARDING === "true";
      return NextResponse.json(
        debug ? { error: fetchError.message, details: fetchError } : { error: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: row });
  } catch (err: unknown) {
    console.error("Onboarding handler error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
