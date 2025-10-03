import { getSupabase } from "@/lib/supabase";
import { Profile, Post } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  BookOpen,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  ExternalLink,
  Clock,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface OverviewAspirantProps {
  profile: Profile;
}

async function getAspirantStats(userId: string, profile: Profile) {
  const supabase = getSupabase();

  try {
    // Get bookmarked resources count
    const { count: bookmarksCount } = await supabase
      .from("post_interactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("interaction_type", "bookmark");

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
      bookmarks: bookmarksCount || 0,
      connections: connectionsCount || 0,
      messages: unreadCount,
      goals: profile.interests?.length || 0,
    };
  } catch (error) {
    console.error("Error fetching aspirant stats:", error);
    return { bookmarks: 0, connections: 0, messages: 0, goals: 0 };
  }
}

async function getRelevantResources() {
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
      .in("type", ["resource", "question", "update"])
      .order("created_at", { ascending: false })
      .limit(5);

    return (posts as unknown as Post[]) || [];
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
}

export default async function OverviewAspirant({
  profile,
}: OverviewAspirantProps) {
  const stats = await getAspirantStats(profile.user_id, profile);
  const resources = await getRelevantResources();

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-semibold dark:text-white">Goals Set</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.goals} active goals
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold dark:text-white">Resources Saved</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.bookmarks} bookmarked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold dark:text-white">Connections</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.connections} mentors
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

      {/* Journey Message */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg dark:text-white mb-1">
                Your Learning Journey
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Explore opportunities, connect with mentors, and build your path
                to success through continuous learning and networking. Every step
                counts!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Learning Resources */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="dark:text-white">Learning Resources</span>
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
              {resources.length > 0 ? (
                resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm dark:text-white">
                          {resource.title}
                        </h4>
                        {resource.content && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {resource.content}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              resource.type === "resource"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : resource.type === "question"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {resource.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(resource.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No resources yet</p>
                  <p className="text-xs mt-1">
                    Check back later for learning materials and guides
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Learning Path */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/posts">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Resources
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/guidance">
                  <Users className="mr-2 h-4 w-4" />
                  Find Mentors
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
                  Check Events
                </Link>
              </Button>
            </div>

            {/* Learning Progress */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h4 className="text-sm font-semibold mb-3 dark:text-white">
                Learning Progress
              </h4>
              <div className="space-y-3">
                {profile.interests?.slice(0, 3).map((interest, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium dark:text-white">
                        {interest}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {30 + idx * 15}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-orange-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${30 + idx * 15}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {(!profile.interests || profile.interests.length === 0) && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Add your interests to track learning progress
                  </p>
                )}
              </div>
            </div>

            {/* Goals Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold dark:text-white">
                  Active Goals
                </h4>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <Target className="h-3 w-3 mr-1" />
                    Set Goal
                  </Link>
                </Button>
              </div>
              {profile.looking_for && profile.looking_for.length > 0 ? (
                <div className="space-y-2">
                  {profile.looking_for.map((goal, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <Target className="w-4 h-4 text-orange-500" />
                      <span className="text-xs dark:text-white">{goal}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  No active goals set. Define your learning objectives!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events & Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    Career Fair 2025
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Oct 10 • Virtual Event
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    Web Development Workshop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Oct 15 • Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    Networking Meet & Greet
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Oct 20 • Mumbai
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                    Saved {stats.bookmarks} learning resources
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Keep exploring new content
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    Connected with {stats.connections} mentors
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Build more meaningful connections
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Target className="w-5 h-5 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    {stats.goals} goals in progress
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Stay focused on your objectives
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
