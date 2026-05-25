// Phase 0C placeholder: database-backed case session start.
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Case session API is deferred to Phase 0C persistence." },
    { status: 501 }
  )
}
