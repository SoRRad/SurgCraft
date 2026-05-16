import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"

export const metadata = { title: "Tutor" }

export default function ChatPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <HandMascot pose="open" size={80} className="mx-auto mb-6 opacity-60" />
        <SectionMarker number="02" label="Tutor mode" className="justify-center mb-3" />
        <h1 className="font-fraunces text-h1 text-ink mb-2">Coming in Week 2</h1>
        <p className="text-body text-ink-muted">
          Streaming chat with citations, RAG retrieval, and role-aware depth.
        </p>
      </div>
    </AppShell>
  )
}
