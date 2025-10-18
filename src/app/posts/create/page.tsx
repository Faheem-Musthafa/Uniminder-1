"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { useRouter } from "next/navigation";

// Zod schema for post creation
const postSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["job", "referral", "update", "question", "resource"]),
  content: z.string().min(10),
  tags: z.string().optional(),
  company: z.string().optional(),
});

type PostForm = z.infer<typeof postSchema>;

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { type: "job" },
  });
  const postType = watch("type");

  const onSubmit = async (data: PostForm) => {
    setLoading(true);
    // TODO: Call API to create post
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    router.push("/posts");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader className="text-xl font-bold">Create Post</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Title" {...register("title")}/>
            {errors.title && <div className="text-destructive text-xs">{errors.title.message}</div>}
            <Select value={postType} onValueChange={(val: string) => { /* hack for RHF */ }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job">Job</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
              </SelectContent>
            </Select>
            {/* Dynamic fields for job/referral */}
            {postType === "job" && (
              <Input placeholder="Company Name" {...register("company")}/>
            )}
            <Textarea placeholder="Content" rows={6} {...register("content")}/>
            {errors.content && <div className="text-destructive text-xs">{errors.content.message}</div>}
            <Input placeholder="Tags (comma separated)" {...register("tags")}/>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Posting..." : "Create Post"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
