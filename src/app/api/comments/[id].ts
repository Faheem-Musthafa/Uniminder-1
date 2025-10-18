// PATCH, DELETE /api/comments/[id]

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, getSupabase } from '@/lib/supabase';
import { AppErrors, handleApiError } from '@/lib/errors';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) throw AppErrors.unauthorized();
    const profile = await db.profiles.findById(userId);
    if (!profile) throw AppErrors.forbidden();
    const commentId = params.id;
    // Fetch comment
    const { data: comment, error: findError } = await getSupabase()
      .from('post_comments')
      .select('*')
      .eq('id', commentId)
      .single();
    if (findError) throw AppErrors.internal(findError.message);
    if (!comment) throw AppErrors.notFound('Comment');
    if (comment.author_id !== profile.id) throw AppErrors.forbidden();

    const body = await req.json();
    const schema = z.object({ content: z.string().min(1, 'Comment cannot be empty') });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw AppErrors.validation('Invalid comment update', parsed.error.flatten());
    }

    const { data, error } = await getSupabase()
      .from('post_comments')
      .update({ content: parsed.data.content, is_edited: true, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .select('*')
      .single();
    if (error) throw AppErrors.internal(error.message);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const err = handleApiError(error);
    return NextResponse.json({ error: err.error, details: err.details }, { status: err.statusCode });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) throw AppErrors.unauthorized();
    const profile = await db.profiles.findById(userId);
    if (!profile) throw AppErrors.forbidden();
    const commentId = params.id;
    // Fetch comment
    const { data: comment, error: findError } = await getSupabase()
      .from('post_comments')
      .select('*')
      .eq('id', commentId)
      .single();
    if (findError) throw AppErrors.internal(findError.message);
    if (!comment) throw AppErrors.notFound('Comment');
    if (comment.author_id !== profile.id) throw AppErrors.forbidden();

    // Delete comment (hard delete)
    const { error } = await getSupabase()
      .from('post_comments')
      .delete()
      .eq('id', commentId);
    if (error) throw AppErrors.internal(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    const err = handleApiError(error);
    return NextResponse.json({ error: err.error, details: err.details }, { status: err.statusCode });
  }
}
