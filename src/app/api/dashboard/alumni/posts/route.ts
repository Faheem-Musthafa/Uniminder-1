import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getSupabase();

    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("author_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching alumni posts:", error);
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: posts || [] });
  } catch (err: unknown) {
    console.error("/api/dashboard/alumni/posts error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
