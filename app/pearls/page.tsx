import Link from "next/link"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Pearls" }

export default function PearlsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <HandMascot pose="ok" size={80} className="mx-auto mb-6 opacity-60" />
        <SectionMarker number="09" label="Coming in Phase 0C" className="justify-center mb-3" />
        <h1 className="font-fraunces text-h1 text-ink mb-3">Pearls</h1>
        <Badge variant="secondary" className="mb-4">Coming soon · No AI API connected yet</Badge>
        <p className="text-body text-ink-muted mb-8">
          Faculty pearls collected from cases, sessions, and pimping debriefs. Each pearl is attributed to the hand service or a named attending. Collectible, shareable (completion only, not scores).
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">← Back to dashboard</Link>
        </Button>
      </div>
    </AppShell>
  )
}
