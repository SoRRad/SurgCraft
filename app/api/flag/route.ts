// Week 2: flag a bot response for faculty review
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Flag API not yet implemented. See Week 2 in BUILD_ORDER.md." },
    { status: 501 }
  )
}
