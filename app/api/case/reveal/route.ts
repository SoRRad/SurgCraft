// Phase 0C placeholder: semantic case card reveal service.
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Card reveal API is deferred to Phase 0C persistence." },
    { status: 501 }
  )
}
