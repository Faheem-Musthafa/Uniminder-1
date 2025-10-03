import { getSupabase } from "@/lib/supabase";
import { Profile, Post } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  Briefcase,
  MessageSquare,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface OverviewAlumniProps {
  profile: Profile;
}

async function getAlumniStats(userId: string) {
  const supabase = getSupabase();

  try {
    // Get posts created count
    const { count: postsCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId)
      .eq("is_active", true);

    // Get total views on all posts
    const { data: posts } = await supabase
      .from("posts")
      .select("views_count, likes_count")
      .eq("author_id", userId);

    const totalViews = posts?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
    const totalLikes = posts?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0;

    // Get connections count
    const { count: connectionsCount } = await supabase
      .from("conversation_participants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

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

    return {
      posts: postsCount || 0,
      views: totalViews,
      likes: totalLikes,
      connections: connectionsCount || 0,
      messages: unreadCount,
    };
  } catch (error) {
    console.error("Error fetching alumni stats:", error);
    return { posts: 0, views: 0, likes: 0, connections: 0, messages: 0 };
  }
}

async function getMyRecentPosts(userId: string) {
  const supabase = getSupabase();

  try {
    const { data: posts } = await supabase
      .from("posts")
      .select("*")
      .eq("author_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5);

    return (posts as unknown as Post[]) || [];
  } catch (error) {
    console.error("Error fetching alumni posts:", error);
    return [];
  }
}

export default async function OverviewAlumni({
  profile,
}: OverviewAlumniProps) {
  const stats = await getAlumniStats(profile.user_id);
  const myPosts = await getMyRecentPosts(profile.user_id);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold dark:text-white">Posts Created</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.posts} total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold dark:text-white">Students Helped</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.connections} connections
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-semibold dark:text-white">Total Views</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.views} on posts
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
      </div>

      {/* Impact Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg dark:text-white mb-1">
                Your Impact Matters
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Share opportunities, mentor students, and build meaningful
                connections with the next generation of professionals. Your
                experience can shape their future.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* My Recent Posts */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="dark:text-white">My Recent Posts</span>
              <Button asChild size="sm">
                <Link href="/posts/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myPosts.length > 0 ? (
                myPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm dark:text-white">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              post.type === "job"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : post.type === "referral"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            }`}
                          >
                            {post.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views_count || 0}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes_count || 0}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments_count || 0}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No posts yet</p>
                  <p className="text-xs mt-1">
                    Share your first opportunity or update
                  </p>
                  <Button asChild className="mt-4" size="sm">
                    <Link href="/posts/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Post
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Engagement */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/posts/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Job Opening
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/posts/create">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Share Referral
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Messages
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/profile">
                  <Users className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
            </div>

            {/* Engagement Stats */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h4 className="text-sm font-semibold mb-3 dark:text-white">
                This Month&apos;s Impact
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Posts Shared
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {stats.posts}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Reach
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {stats.views} views
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Engagement
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {stats.likes} likes
                  </span>
                </div>
              </div>
            </div>

            {/* Mentor Badge */}
            {stats.connections > 10 && (
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
                      Active Mentor
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Helping {stats.connections}+ students
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Interactions */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.messages > 0 && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    {stats.messages} new messages from students
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Reply to build stronger connections
                  </p>
                </div>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/messages">View</Link>
                </Button>
              </div>
            )}
            {stats.posts > 0 && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    Your posts reached {stats.views} students
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Keep sharing to increase your impact
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
