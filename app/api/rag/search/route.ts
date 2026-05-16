// Week 2 (stub) → Week 4 (real pgvector): knowledge base retrieval
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "RAG search not yet implemented. See Week 2/4 in BUILD_ORDER.md." },
    { status: 501 }
  )
}
