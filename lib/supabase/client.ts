// NOT WIRED IN PHASE 0A. Supabase is reserved for Phase 0C+.
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.warn(
        "[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. " +
        "Running in Phase 0A demo mode - Supabase client is unavailable."
      )
    }
    return null
  }

  return createBrowserClient<Database>(url, key)
}

