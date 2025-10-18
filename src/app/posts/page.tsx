"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import Link from "next/link";

// Post type options
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

export default function PostsFeedPage() {
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
      .finally(() => setLoading(false));
  }, [type, search, tags]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <div className="flex flex-col md:flex-row gap-2 mb-6 items-center">
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
        <div className="w-full md:w-40">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <span className="truncate">
                <SelectValue placeholder="All Types" />
              </span>
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
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
          className="w-full md:w-56"
        />
      </div>
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No posts found.</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                  </span>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{post.type}</Badge>
                    {(post.tags || []).map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  by {post.author_name || "Unknown"}
                  <br />
                  <span suppressHydrationWarning>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="line-clamp-3 text-sm mb-2">{post.content}</div>
                <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                  <span>👍 {post.likes_count || 0}</span>
                  <span>💬 {post.comments_count || 0}</span>
                  <span>👁️ {post.views_count || 0}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
