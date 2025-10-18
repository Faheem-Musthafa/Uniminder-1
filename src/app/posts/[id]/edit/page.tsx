"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { useRouter, useParams } from "next/navigation";

const postSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["job", "referral", "update", "question", "resource"]),
  content: z.string().min(10),
  tags: z.string().optional(),
  company: z.string().optional(),
});

type PostForm = z.infer<typeof postSchema>;

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState<PostForm | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
  });
  const postType = watch("type");

  useEffect(() => {
    // Fetch post data for editing
    fetch(`/api/posts/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setInitial(data.post);
        reset(data.post);
      });
  }, [params.id, reset]);

  const onSubmit = async (data: PostForm) => {
    setLoading(true);
    await fetch(`/api/posts/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    router.push("/posts");
  };

  if (!initial) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader className="text-xl font-bold">Edit Post</CardHeader>
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
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving..." : "Save Changes"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
