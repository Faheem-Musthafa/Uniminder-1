// Posts API route: GET (browse all), POST (create new post)

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, getSupabase } from '@/lib/supabase';
import { createPostSchema } from './schema';
import { AppErrors, handleApiError } from '@/lib/errors';
import { isAlumni } from './utils';

export async function GET(req: NextRequest) {
  try {
    // Filters: type, search (title/content), tags (comma separated -> array contains)
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type')?.trim();
    const search = searchParams.get('search')?.trim();
    const tagsParam = searchParams.get('tags')?.trim();

    let query = getSupabase()
      .from('posts')
      .select(`*, author:profiles!posts_author_id_fkey(id, full_name, profile_image_url, role, company, designation)`) // avatar_url does not exist; using profile_image_url
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (search) {
      // Search in title or content
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (tagsParam) {
      const tags = tagsParam
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (tags.length) {
        // posts.tags is text[]; use contains to match all provided tags
        query = query.contains('tags', tags);
      }
    }

    const { data, error } = await query;

    if (error) throw AppErrors.internal(error.message);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const err = handleApiError(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) throw AppErrors.unauthorized();

    // Get user profile
    const profile = await db.profiles.findById(userId);
    if (!profile) throw AppErrors.forbidden();
    if (!isAlumni(profile)) throw AppErrors.forbidden();

    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      throw AppErrors.validation('Invalid post data', parsed.error.flatten());
    }

    const now = new Date().toISOString();
    const payload = {
      ...parsed.data,
      author_id: profile.id,
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await getSupabase()
      .from('posts')
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
