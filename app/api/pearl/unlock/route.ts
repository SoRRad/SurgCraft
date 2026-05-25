// Phase 0C placeholder: database-backed pearl unlocks.
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Pearl unlock API is deferred to Phase 0C persistence." },
    { status: 501 }
  )
}
