// Week 2: streaming Anthropic chat with RAG retrieval
// Implement in Week 2 — see prompts/tutor.md for system prompt
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Chat API not yet implemented. See Week 2 in BUILD_ORDER.md." },
    { status: 501 }
  )
}
