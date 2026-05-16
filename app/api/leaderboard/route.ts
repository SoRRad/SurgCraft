// Phase 1: cohort-scoped leaderboard (opt-in only)
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    { error: "Leaderboard API deferred to Phase 1." },
    { status: 501 }
  )
}
