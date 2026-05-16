import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"

export const metadata = { title: "Pearls" }

export default function PearlsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <SectionMarker number="04" label="Pearls" className="justify-center mb-3" />
        <h1 className="font-fraunces text-h1 text-ink mb-2">Coming in Week 4</h1>
        <p className="text-body text-ink-muted">
          Collectible faculty pearls, unlocked as you play cases.
        </p>
      </div>
    </AppShell>
  )
}
