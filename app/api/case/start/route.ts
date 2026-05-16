// Week 3: load or generate a case
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Case API not yet implemented. See Week 3 in BUILD_ORDER.md." },
    { status: 501 }
  )
}
