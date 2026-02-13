import "server-only";

type UpsertOptions = {
  onConflict?: string;
};

type WaitlistPayload = Record<string, string | number | boolean | null>;

type SupabaseAdminClient = {
  from: (table: string) => {
    upsert: (payload: WaitlistPayload, options?: UpsertOptions) => Promise<void>;
  };
};

let cachedClient: SupabaseAdminClient | null = null;

export function getSupabaseAdminClient(): SupabaseAdminClient {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  cachedClient = {
    from: (table: string) => ({
      upsert: async (payload: WaitlistPayload, options?: UpsertOptions) => {
        const url = new URL(`/rest/v1/${table}`, supabaseUrl);
        const onConflict = options?.onConflict;
        if (onConflict) {
          url.searchParams.set("on_conflict", onConflict);
        }

        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseServiceRoleKey,
            Authorization: `Bearer ${supabaseServiceRoleKey}`,
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Supabase upsert failed");
        }
      },
    }),
  };

  return cachedClient;
}
