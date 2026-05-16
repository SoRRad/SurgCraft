// Week 5: pre-op prep structured output
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Pre-op API not yet implemented. See Week 5 in BUILD_ORDER.md." },
    { status: 501 }
  )
}
