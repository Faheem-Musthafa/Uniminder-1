// Edge Runtime compatible Supabase client for middleware
export function createEdgeSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: string) => ({
          single: async () => {
            const response = await fetch(`${url}/rest/v1/${table}?${column}=eq.${value}&select=${columns}`, {
              headers: {
                'apikey': anonKey,
                'Authorization': `Bearer ${anonKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.pgrst.object+json'
              }
            });

            if (!response.ok) {
              return { data: null, error: { message: 'Database query failed' } };
            }

            const data = await response.json();
            return { data: data || null, error: null };
          }
        })
      })
    })
  };
}
