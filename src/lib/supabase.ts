import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Profile } from "@/types";

let _supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (_supabase) return _supabase;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set at runtime"
    );
  }

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
  return _supabase;
}

// Typed database helpers
export const db = {
  profiles: {
    findById: async (id: string) => {
      const { data, error } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Profile;
    },

    upsert: async (profile: Partial<Profile>) => {
      const { data, error } = await getSupabase()
        .from("profiles")
        .upsert(profile, { onConflict: "id" })
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },

    findByRole: async (role: Profile["role"]) => {
      const { data, error } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("role", role);

      if (error) throw error;
      return data as Profile[];
    },
  },
};
