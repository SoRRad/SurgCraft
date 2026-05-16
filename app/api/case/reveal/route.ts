// Week 3: semantic card reveal via Claude
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Card reveal API not yet implemented. See Week 3 in BUILD_ORDER.md." },
    { status: 501 }
  )
}
