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
      .select(
        `
        *,
        author:profiles!posts_author_id_fkey(
          id, full_name, profile_image_url, role, company, designation
        )
      `
      )
      .eq("is_active", true)
      .in("type", ["resource", "question", "update"])
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching aspirant resources:", error);
      return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: posts || [] });
  } catch (err: unknown) {
    console.error("/api/dashboard/aspirant/resources error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
