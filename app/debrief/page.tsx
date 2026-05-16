import Link from "next/link"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "OR Debrief" }

export default function DebriefPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <HandMascot pose="fist" size={80} className="mx-auto mb-6 opacity-60" />
        <SectionMarker number="08" label="Coming in Phase 1" className="justify-center mb-3" />
        <h1 className="font-fraunces text-h1 text-ink mb-3">OR Debrief</h1>
        <Badge variant="secondary" className="mb-4">Coming soon · No AI API connected yet</Badge>
        <p className="text-body text-ink-muted mb-8">
          Describe a case you just scrubbed. The tutor asks reflective questions — what was the indication, what was the key decision point, what would you do differently as primary — and fills in knowledge gaps as they emerge.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">← Back to dashboard</Link>
        </Button>
      </div>
    </AppShell>
  )
}
