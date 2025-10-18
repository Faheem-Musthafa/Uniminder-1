import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getSupabase();

    // Bookmarks count
    const { count: bookmarksCount } = await supabase
      .from("post_interactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("interaction_type", "bookmark");

    // Connections count
    const { count: connectionsCount } = await supabase
      .from("conversation_participants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Unread messages count
    const { data: conversations } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", userId);

    const conversationIds = conversations?.map((c) => c.conversation_id) || [];

    let unreadCount = 0;
    if (conversationIds.length > 0) {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("conversation_id", conversationIds)
        .neq("sender_id", userId);
      unreadCount = count || 0;
    }

    // Goals: use interests length from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("interests")
      .eq("user_id", userId)
      .single();

    const goals = Array.isArray(profile?.interests) ? profile!.interests.length : 0;

    return NextResponse.json({
      success: true,
      data: {
        bookmarks: bookmarksCount || 0,
        connections: connectionsCount || 0,
        messages: unreadCount,
        goals,
      },
    });
  } catch (err: unknown) {
    console.error("/api/dashboard/aspirant/stats error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
