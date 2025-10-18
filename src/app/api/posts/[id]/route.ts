// Posts API route: GET (single post), PATCH (edit), DELETE (remove)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, getSupabase } from '@/lib/supabase';
import { updatePostSchema } from '../schema';
import { AppErrors, handleApiError } from '@/lib/errors';
import { isAlumni } from '../utils';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const post = await db.posts.findById(id);
    if (!post) throw AppErrors.notFound('Post');
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    const err = handleApiError(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) throw AppErrors.unauthorized();
    const profile = await db.profiles.findById(userId);
    if (!profile) throw AppErrors.forbidden();

    const { id } = await context.params;
    const post = await db.posts.findById(id);
    if (!post) throw AppErrors.notFound('Post');
    // Only author or alumni can edit
    if (post.author_id !== profile.id && !isAlumni(profile)) throw AppErrors.forbidden();

    const body = await req.json();
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      throw AppErrors.validation('Invalid post update', parsed.error.flatten());
    }

    const updatePayload = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await getSupabase()
      .from('posts')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw AppErrors.internal(error.message);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const err = handleApiError(error);
    return NextResponse.json({ error: err.error, details: err.details }, { status: err.statusCode });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) throw AppErrors.unauthorized();
    const profile = await db.profiles.findById(userId);
    if (!profile) throw AppErrors.forbidden();

    const { id } = await context.params;
    const post = await db.posts.findById(id);
    if (!post) throw AppErrors.notFound('Post');
    // Only author or alumni can delete
    if (post.author_id !== profile.id && !isAlumni(profile)) throw AppErrors.forbidden();

    // Soft delete: set is_active = false
    const { data, error } = await getSupabase()
      .from('posts')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw AppErrors.internal(error.message);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const err = handleApiError(error);
    return NextResponse.json({ error: err.error, details: err.details }, { status: err.statusCode });
  }
}
