import { getSupabase } from "@/lib/supabase";
import { Profile, Post } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  MessageSquare,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  ExternalLink,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface OverviewStudentProps {
  profile: Profile;
}

async function getStudentStats(userId: string) {
  const supabase = getSupabase();

  try {
    // Get post interactions count
    const { count: bookmarksCount } = await supabase
      .from("post_interactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("interaction_type", "bookmark");

    const { count: applicationsCount } = await supabase
      .from("post_interactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("interaction_type", "apply");

    // Get unread messages count
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

    // Get connections count (alumni/aspirants they've interacted with)
    const { count: connectionsCount } = await supabase
      .from("conversation_participants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    return {
      bookmarks: bookmarksCount || 0,
      applications: applicationsCount || 0,
      messages: unreadCount,
      connections: connectionsCount || 0,
    };
  } catch (error) {
    console.error("Error fetching student stats:", error);
    return { bookmarks: 0, applications: 0, messages: 0, connections: 0 };
  }
}

async function getRecentPosts() {
  const supabase = getSupabase();

  try {
    const { data: posts } = await supabase
      .from("posts")
      .select(
        `
        *,
        author:profiles!posts_author_id_fkey(
          id, full_name, avatar_url, role, company, designation
        )
      `
      )
      .eq("is_active", true)
      .in("type", ["job", "referral"])
      .order("created_at", { ascending: false })
      .limit(5);

    return (posts as unknown as Post[]) || [];
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}

export default async function OverviewStudent({
  profile,
}: OverviewStudentProps) {
  const stats = await getStudentStats(profile.user_id);
  const recentPosts = await getRecentPosts();

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold dark:text-white">Applications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.applications} submitted
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold dark:text-white">Saved Posts</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.bookmarks} bookmarked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold dark:text-white">Messages</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.messages} unread
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-semibold dark:text-white">Connections</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.connections} mentors
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Job Posts */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="dark:text-white">Recent Opportunities</span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/posts">
                  View All
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm dark:text-white">
                          {post.title}
                        </h4>
                        {post.company_name && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {post.company_name}
                            {post.location && ` • ${post.location}`}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              post.type === "job"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {post.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No opportunities yet</p>
                  <p className="text-xs mt-1">
                    Check back later for job posts and referrals
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Info */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Welcome!</strong> Explore job opportunities, connect
                with alumni, and build your professional network.
              </p>
            </div>

            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/posts">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Job Posts
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Messages
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Check Calendar
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/profile">
                  <Users className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
            </div>

            {/* Profile Completion */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium dark:text-white">
                  Profile Completion
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {profile.skills?.length ? 85 : 60}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${profile.skills?.length ? 85 : 60}%` }}
                ></div>
              </div>
              {!profile.skills?.length && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Add your skills to improve your profile
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">
                  Profile viewed by 12 alumni this week
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keep your profile updated
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">
                  {recentPosts.length} new opportunities this week
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Check them out now
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
