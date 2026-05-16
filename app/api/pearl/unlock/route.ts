// Week 3: unlock a pearl on case completion
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Pearl unlock API not yet implemented. See Week 3 in BUILD_ORDER.md." },
    { status: 501 }
  )
}
