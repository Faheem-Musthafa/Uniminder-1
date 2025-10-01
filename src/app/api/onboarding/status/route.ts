import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getSupabase();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, onboarded, full_name, role")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        exists: !!profile,
        onboarded: profile?.onboarded ?? false,
        role: profile?.role ?? null,
        hasName: !!profile?.full_name,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
