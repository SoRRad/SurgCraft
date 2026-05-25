import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { DO_NOT_MISS } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Do-Not-Miss" }

const CLINICAL_CALLOUT =
  "In a real clinical scenario, this is escalated to your senior and hand surgery — never managed from this app."

function DoNotMissCard({ entry, index }: {
  entry: typeof DO_NOT_MISS[number]
  index: number
}) {
  return (
    <article className="border border-rule rounded-lg bg-bg-elevated overflow-hidden">
      <div className="px-5 py-4 border-b border-rule bg-bg flex items-start gap-3">
        <span className="font-mono text-micro text-ink-muted flex-shrink-0 mt-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h2 className="font-fraunces text-h3 text-terracotta leading-tight">{entry.diagnosis}</h2>
        </div>
      </div>
      <div className="divide-y divide-rule">
        <div className="px-5 py-4">
          <p className="text-micro text-ink-muted uppercase tracking-wider font-semibold mb-1.5">The clue</p>
          <p className="text-body text-ink leading-relaxed">{entry.clue}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-micro text-ink-muted uppercase tracking-wider font-semibold mb-1.5">Why it matters</p>
          <p className="text-body text-ink leading-relaxed">{entry.badOutcome}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-micro text-ink-muted uppercase tracking-wider font-semibold mb-1.5">Educational point</p>
          <p className="text-body text-ink leading-relaxed">{entry.educationalPoint}</p>
        </div>
      </div>
      <div className="mx-5 mb-5 mt-3 rounded px-4 py-3 border-l-[3px] border-wrong bg-wrong-soft" role="note">
        <p className="text-small text-ink-muted italic">{CLINICAL_CALLOUT}</p>
      </div>
    </article>
  )
}

export default function DoNotMissPage() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-10">

          {/* Header */}
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <SectionMarker number="05" label="Do-Not-Miss" className="mb-3" />
              <h1 className="font-fraunces text-h1 text-ink mb-3">Do-not-miss diagnoses</h1>
              <p className="text-body text-ink-muted max-w-2xl">
                These are the diagnoses where delayed recognition leads to irreversible harm. Know the clue, know the consequence, know the escalation path.
              </p>
              <div className="mt-4 p-4 border border-rule rounded-lg bg-bg-elevated">
                <p className="text-small text-ink-muted leading-relaxed">
                  <strong className="text-ink">Educational use only.</strong> This page teaches recognition clues and educational context. It is not real-patient care guidance. In any real clinical scenario involving these diagnoses, escalate immediately to your senior resident and attending.
                </p>
              </div>
            </div>
            <a
              href="/c?prefill=Walk+me+through+do-not-miss+diagnoses+in+hand+surgery"
              className="flex-shrink-0 px-4 py-2 rounded-lg bg-electric text-bg text-small font-medium hover:opacity-90 transition-opacity duration-150 whitespace-nowrap"
            >
              Use in chat →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DO_NOT_MISS.map((entry, index) => (
              <DoNotMissCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>

          <p className="mt-8 text-micro text-ink-muted text-center">
            Local demo content · All content synthetic · Needs faculty verification before pilot use
          </p>

        </div>
      </div>
    </ChatLayout>
  )
}
