import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"

export const metadata = { title: "Cases" }

export default function CasePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <HandMascot pose="open" size={80} className="mx-auto mb-6 opacity-60" />
        <SectionMarker number="03" label="Case Unfolds" className="justify-center mb-3" />
        <h1 className="font-fraunces text-h1 text-ink mb-2">Coming in Week 3</h1>
        <p className="text-body text-ink-muted">
          Progressive card reveal with 3 seed cases.
        </p>
      </div>
    </AppShell>
  )
}
