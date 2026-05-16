import Link from "next/link"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Consult Mode" }

export default function ConsultPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <HandMascot pose="open" size={80} className="mx-auto mb-6 opacity-60" />
        <SectionMarker number="08" label="Coming in Phase 1" className="justify-center mb-3" />
        <h1 className="font-fraunces text-h1 text-ink mb-3">Consult Mode</h1>
        <Badge variant="secondary" className="mb-4">Coming soon · No AI API connected yet</Badge>
        <p className="text-body text-ink-muted mb-8">
          You are the hand surgery resident receiving a consult. The bot plays the ED resident — presenting a case, answering questions, waiting for your disposition. Scored on completeness and justification.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">← Back to dashboard</Link>
        </Button>
      </div>
    </AppShell>
  )
}
