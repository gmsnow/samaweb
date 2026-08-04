import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    logger.warn("supabase/client", "NEXT_PUBLIC_SUPABASE_URL is not set");
    return "https://placeholder.supabase.co";
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    logger.warn(
      "supabase/client",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
    );
    return "placeholder-anon-key";
  }
  return key;
}

export const supabaseBrowser = createClient(
  getSupabaseUrl(),
  getSupabaseAnonKey(),
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
