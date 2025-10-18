// GET, POST /api/posts/[id]/comments

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, getSupabase } from '@/lib/supabase';
import { AppErrors, handleApiError } from '@/lib/errors';
import { z } from 'zod';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    // Fetch all comments for the post, newest first, include author
    const { data, error } = await getSupabase()
      .from('post_comments')
      .select(`*, author:profiles(id, full_name, profile_image_url, role)`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (error) throw AppErrors.internal(error.message);
    // Optionally: build threaded structure here (client can also do this)
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const err = handleApiError(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

type CommentInsert = {
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_comment_id?: number;
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) throw AppErrors.unauthorized();
    const profile = await db.profiles.findById(userId);
    if (!profile) throw AppErrors.forbidden();
  const { id: postId } = await context.params;
    const body = await req.json();

    // Validate input
    const schema = z.object({
      content: z.string().min(1, 'Comment cannot be empty'),
      parent_comment_id: z.number().optional(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw AppErrors.validation('Invalid comment data', parsed.error.flatten());
    }

    const payload: CommentInsert = {
      post_id: postId,
      author_id: profile.id,
      content: parsed.data.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (parsed.data.parent_comment_id) {
      payload.parent_comment_id = parsed.data.parent_comment_id;
    }

    const { data, error } = await getSupabase()
      .from('post_comments')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw AppErrors.internal(error.message);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const err = handleApiError(error);
    return NextResponse.json({ error: err.error, details: err.details }, { status: err.statusCode });
  }
}
