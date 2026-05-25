#!/usr/bin/env tsx
// Week 4: Walk content/kb/, embed each chunk, upsert to Supabase pgvector
//
// Usage: npx tsx scripts/ingest-kb.ts
//
// Dependencies needed in Week 4:
//   npm install @anthropic-ai/sdk (or voyage-ai) tsx glob

import * as fs from "fs"
import * as path from "path"

const KB_DIR = path.join(process.cwd(), "content/kb")

async function main() {
  console.log("KB ingestion - implement in Week 4")
  console.log(`KB directory: ${KB_DIR}`)

  if (!fs.existsSync(KB_DIR)) {
    console.error("content/kb/ not found")
    process.exit(1)
  }

  // TODO Week 4:
  // 1. Walk KB_DIR recursively for *.md files
  // 2. Parse frontmatter (id, source_type, verified, tags)
  // 3. Chunk content by paragraph (~512 tokens max)
  // 4. Embed via Anthropic or Voyage API
  // 5. Upsert to kb_chunks table with embedding vector
  console.log("Not yet implemented — planned for Phase 0C")
}

main().catch(console.error)

