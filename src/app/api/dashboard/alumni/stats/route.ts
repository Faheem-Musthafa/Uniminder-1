import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getSupabase();

    // Posts count
    const { count: postsCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId)
      .eq("is_active", true);

    // Aggregate views and likes
    const { data: posts } = await supabase
      .from("posts")
      .select("views_count, likes_count")
      .eq("author_id", userId);

    const totalViews = posts?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
    const totalLikes = posts?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0;

    // Connections count
    const { count: connectionsCount } = await supabase
      .from("conversation_participants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Unread messages (approx)
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

    return NextResponse.json({
      success: true,
      data: {
        posts: postsCount || 0,
        views: totalViews,
        likes: totalLikes,
        connections: connectionsCount || 0,
        messages: unreadCount,
      },
    });
  } catch (err: unknown) {
    console.error("/api/dashboard/alumni/stats error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
