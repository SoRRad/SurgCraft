import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"

export const metadata = { title: "Pre-Op Prep" }

export default function PreopPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <SectionMarker number="05" label="Pre-Op Prep" className="justify-center mb-3" />
        <h1 className="font-fraunces text-h1 text-ink mb-2">Coming in Week 5</h1>
        <p className="text-body text-ink-muted">
          Anatomy refresher, approach overview, intra-op questions, and pearls.
        </p>
      </div>
    </AppShell>
  )
}
