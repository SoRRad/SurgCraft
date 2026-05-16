// Week 5: generate pimping question + grade response
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Pimping API not yet implemented. See Week 5 in BUILD_ORDER.md." },
    { status: 501 }
  )
}
