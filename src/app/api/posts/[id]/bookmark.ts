// POST /api/posts/[id]/bookmark - Bookmark/unbookmark a post

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, getSupabase } from '@/lib/supabase';
import { AppErrors, handleApiError } from '@/lib/errors';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) throw AppErrors.unauthorized();
    const profile = await db.profiles.findById(userId);
    if (!profile) throw AppErrors.forbidden();
    const postId = params.id;

    // Check if already bookmarked
    const { data: existing, error: findError } = await getSupabase()
      .from('post_interactions')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', profile.id)
      .eq('interaction_type', 'bookmark')
      .single();

    if (findError && findError.code !== 'PGRST116') throw AppErrors.internal(findError.message);

    if (existing) {
      // Unbookmark (delete interaction)
      const { error: delError } = await getSupabase()
        .from('post_interactions')
        .delete()
        .eq('id', existing.id);
      if (delError) throw AppErrors.internal(delError.message);
      return NextResponse.json({ success: true, bookmarked: false });
    } else {
      // Bookmark (insert interaction)
      const { error: insError } = await getSupabase()
        .from('post_interactions')
        .insert({ post_id: postId, user_id: profile.id, interaction_type: 'bookmark' });
      if (insError) throw AppErrors.internal(insError.message);
      return NextResponse.json({ success: true, bookmarked: true });
    }
  } catch (error) {
    const err = handleApiError(error);
    return NextResponse.json({ error: err.error, details: err.details }, { status: err.statusCode });
  }
}
