import Link from "next/link"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Settings" }

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <HandMascot pose="open" size={80} className="mx-auto mb-6 opacity-60" />
        <SectionMarker number="10" label="Profile and settings" className="justify-center mb-3" />
        <h1 className="font-fraunces text-h1 text-ink mb-3">Settings</h1>
        <Badge variant="secondary" className="mb-4">Coming soon</Badge>
        <p className="text-body text-ink-muted mb-8">
          Edit your role, specialty, comfort ratings, and anonymous handle. Manage privacy settings and opt-in preferences for leaderboards.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">← Back to dashboard</Link>
        </Button>
      </div>
    </AppShell>
  )
}
