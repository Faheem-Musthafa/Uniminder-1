import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Profile, Post } from "@/types";

/**
 * Singleton Supabase client instance
 * Reused across the application to prevent multiple connections
 */
let _supabase: SupabaseClient | null = null;

/**
 * Get or create a Supabase client instance
 * @returns Configured Supabase client
 * @throws Error if environment variables are not set
 */
export function getSupabase(): SupabaseClient {
  // Return existing instance if available
  if (_supabase) return _supabase;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    const error = new Error(
      "Missing Supabase configuration: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
    );
    console.error("[Supabase] Configuration error:", error.message);
    throw error;
  }

  try {
    _supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          "X-Client-Info": "uniminder-server",
        },
      },
    });
    
    console.log("[Supabase] Client initialized successfully");
    return _supabase;
  } catch (error) {
    console.error("[Supabase] Failed to create client:", error);
    throw error;
  }
}

/**
 * Type-safe database helpers with error handling and logging
 */
export const db = {
  profiles: {
    /**
     * Find a profile by ID
     * @param id - Profile ID (Clerk user ID)
     * @returns Profile data or null if not found
     */
    findById: async (id: string): Promise<Profile | null> => {
      try {
        const { data, error } = await getSupabase()
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // Profile not found - not an error
            return null;
          }
          console.error("[DB] Error fetching profile:", error);
          throw error;
        }

        return data as Profile;
      } catch (error) {
        console.error("[DB] findById error:", error);
        throw error;
      }
    },

    /**
     * Find a profile by user_id
     * @param userId - Clerk user ID
     * @returns Profile data or null if not found
     */
    findByUserId: async (userId: string): Promise<Profile | null> => {
      try {
        const { data, error } = await getSupabase()
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return null;
          }
          console.error("[DB] Error fetching profile by user_id:", error);
          throw error;
        }

        return data as Profile;
      } catch (error) {
        console.error("[DB] findByUserId error:", error);
        throw error;
      }
    },

    /**
     * Create or update a profile
     * @param profile - Partial profile data
     * @returns Updated profile data
     */
    upsert: async (profile: Partial<Profile>): Promise<Profile> => {
      try {
        const { data, error } = await getSupabase()
          .from("profiles")
          .upsert(profile, { onConflict: "id" })
          .select()
          .single();

        if (error) {
          console.error("[DB] Error upserting profile:", error);
          throw error;
        }

        return data as Profile;
      } catch (error) {
        console.error("[DB] upsert error:", error);
        throw error;
      }
    },

    /**
     * Find profiles by role
     * @param role - User role to filter by
     * @returns Array of profiles
     */
    findByRole: async (role: Profile["role"]): Promise<Profile[]> => {
      try {
        const { data, error } = await getSupabase()
          .from("profiles")
          .select("*")
          .eq("role", role)
          .eq("is_active", true);

        if (error) {
          console.error("[DB] Error fetching profiles by role:", error);
          throw error;
        }

        return (data as Profile[]) || [];
      } catch (error) {
        console.error("[DB] findByRole error:", error);
        throw error;
      }
    },
  },

  posts: {
    /**
     * Find a post by ID with author information
     * @param id - Post ID
     * @returns Post data with author or null
     */
    findById: async (id: string): Promise<Post | null> => {
      try {
        const { data, error } = await getSupabase()
          .from("posts")
          .select(`
            *,
            author:profiles!posts_author_id_fkey(
              id, full_name, avatar_url, role, company, designation
            )
          `)
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return null;
          }
          console.error("[DB] Error fetching post:", error);
          throw error;
        }

        return data as Post;
      } catch (error) {
        console.error("[DB] posts.findById error:", error);
        throw error;
      }
    },

    /**
     * Find posts by author ID
     * @param authorId - Profile ID of the author
     * @returns Array of posts
     */
    findByAuthor: async (authorId: string): Promise<Post[]> => {
      try {
        const { data, error } = await getSupabase()
          .from("posts")
          .select("*")
          .eq("author_id", authorId)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[DB] Error fetching posts by author:", error);
          throw error;
        }

        return (data as Post[]) || [];
      } catch (error) {
        console.error("[DB] posts.findByAuthor error:", error);
        throw error;
      }
    },
  },
};
