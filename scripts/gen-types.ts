#!/usr/bin/env tsx
// Generate Supabase TypeScript types from the database schema
//
// Usage: npx tsx scripts/gen-types.ts
// Or:    npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
//
// Requires: supabase CLI installed and logged in

import { execSync } from "child_process"

const projectId = process.env.SUPABASE_PROJECT_ID

if (!projectId) {
  console.log("Set SUPABASE_PROJECT_ID env var, then run:")
  console.log("  npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > lib/supabase/types.ts")
  process.exit(0)
}

try {
  execSync(
    `npx supabase gen types typescript --project-id ${projectId} > lib/supabase/types.ts`,
    { stdio: "inherit" }
  )
  console.log("Types generated → lib/supabase/types.ts")
} catch {
  console.error("Type generation failed. Is supabase CLI installed?")
}
