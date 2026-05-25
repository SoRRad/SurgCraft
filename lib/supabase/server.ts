// NOT WIRED IN PHASE 0A. Supabase is reserved for Phase 0C+.
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./types"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. " +
      "Running in Phase 0A demo mode - Supabase server client is unavailable."
    )
    return null
  }

  const cookieStore = cookies()

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server component - cookie writes handled by middleware
        }
      },
    },
  })
}

