"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PostsFeedProps {
  profile: Profile;
  onBack: () => void;
}

const POST_TYPES = [
  { value: "job", label: "Job" },
  { value: "referral", label: "Referral" },
  { value: "update", label: "Update" },
  { value: "question", label: "Question" },
  { value: "resource", label: "Resource" },
];

type PostListItem = {
  id: string;
  title: string;
  content?: string;
  type: string;
  tags?: string[];
  author_name?: string;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
};

export default function PostsFeed({ profile, onBack }: PostsFeedProps) {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>("");
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    // TODO: Replace with real API call
    fetch(`/api/posts?type=${type}&search=${search}&tags=${tags}`)
      .then((res) => res.json())
      .then((data) => setPosts(data?.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [type, search, tags]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">Opportunities & Updates</h1>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="w-full md:w-1/3"
            />
            <div className="w-full md:w-40">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Tags"
              value={tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
              className="w-full md:w-56"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-8 px-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>No posts found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/posts/${post.id}`}>
                        <h3 className="font-semibold text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="outline">{post.type}</Badge>
                        {(post.tags || []).map((tag: string) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right ml-4">
                      <p className="font-medium">{post.author_name || "Unknown"}</p>
                      <p suppressHydrationWarning>{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm mb-4">{post.content}</p>
                    <div className="flex gap-6 text-xs text-muted-foreground">
                      <span>👍 {post.likes_count || 0} Likes</span>
                      <span>💬 {post.comments_count || 0} Comments</span>
                      <span>👁️ {post.views_count || 0} Views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
