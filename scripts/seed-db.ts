#!/usr/bin/env tsx
// Seed the database with cases, pearls from content/
//
// Usage: npx tsx scripts/seed-db.ts
//
// Reads: content/cases/*.json, content/pearls/seed-pearls.json
// Upserts to: cases, pearls tables

import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  // Seed cases
  const casesDir = path.join(process.cwd(), "content/cases")
  const caseFiles = fs.readdirSync(casesDir).filter((f) => f.endsWith(".json"))

  for (const file of caseFiles) {
    const raw = JSON.parse(fs.readFileSync(path.join(casesDir, file), "utf-8"))
    const { error } = await supabase.from("cases").upsert({
      id: raw.id,
      title: raw.title,
      stem: raw.stem,
      cards_jsonb: raw.cards,
      difficulty: raw.difficulty,
      tags: raw.tags,
      author: raw.author,
      verified: raw.verified,
    })
    if (error) console.error(`Error seeding ${file}:`, error.message)
    else console.log(`Seeded case: ${raw.title}`)
  }

  // Seed pearls
  const pearlsFile = path.join(process.cwd(), "content/pearls/seed-pearls.json")
  const pearls = JSON.parse(fs.readFileSync(pearlsFile, "utf-8"))
  for (const pearl of pearls) {
    const { error } = await supabase.from("pearls").upsert(pearl)
    if (error) console.error(`Error seeding pearl ${pearl.id}:`, error.message)
    else console.log(`Seeded pearl: ${pearl.id}`)
  }

  console.log("Seeding complete.")
}

main().catch(console.error)
