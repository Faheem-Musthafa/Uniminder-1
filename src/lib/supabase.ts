import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!, // not NEXT_PUBLIC
  process.env.SUPABASE_SERVICE_ROLE_KEY! // full access
);
