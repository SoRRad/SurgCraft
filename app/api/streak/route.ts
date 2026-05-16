// Week 4: streak ring update
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ question_ring: 0, case_ring: 0, review_ring: 0 })
}

export async function POST() {
  return NextResponse.json(
    { error: "Streak update API not yet implemented. See Week 4 in BUILD_ORDER.md." },
    { status: 501 }
  )
}
