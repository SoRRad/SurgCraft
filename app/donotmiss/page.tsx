import Link from "next/link"
import { Eye, MessageSquare, ShieldAlert } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Button } from "@/components/ui/button"
import { DO_NOT_MISS } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Do-Not-Miss" }

const CLINICAL_CALLOUT =
  "For real patients, escalate to your senior resident and attending. Do not use this app for clinical decisions."

function DoNotMissCard({ entry, index }: {
  entry: typeof DO_NOT_MISS[number]
  index: number
}) {
  return (
    <article className="rounded-2xl border border-wrong-soft bg-bg-elevated p-5 shadow-soft transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:shadow-medium">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-wrong-soft font-mono text-micro text-wrong">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p className="mb-1 text-micro font-semibold uppercase tracking-[0.16em] text-wrong">Do not miss</p>
          <h2 className="font-fraunces text-h3 leading-tight text-ink">{entry.diagnosis}</h2>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: "Recognition clue", value: entry.clue },
          { label: "Why it matters", value: entry.badOutcome },
          { label: "Educational point", value: entry.educationalPoint },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-bg px-4 py-3">
            <p className="mb-1 text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">{label}</p>
            <p className="text-small leading-relaxed text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-wrong-soft bg-wrong-soft/45 px-4 py-3" role="note">
        <p className="text-small italic text-ink-muted">{CLINICAL_CALLOUT}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/c?prefill=${encodeURIComponent(`Quiz me on do-not-miss diagnosis: ${entry.diagnosis}`)}`}>
            <MessageSquare size={14} />
            Quiz me
          </Link>
        </Button>
      </div>
    </article>
  )
}

export default function DoNotMissPage() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <SectionMarker number="05" label="Do-Not-Miss" className="mb-3" />
              <h1 className="font-fraunces text-h1 text-ink">Do-not-miss diagnoses</h1>
              <p className="mt-3 text-body text-ink-muted">
                Recognition clues for high-stakes hand diagnoses where delayed recognition can cause permanent harm.
              </p>
            </div>
            <Button asChild>
              <Link href="/c?prefill=Walk%20me%20through%20do-not-miss%20diagnoses%20in%20hand%20surgery">
                <Eye size={15} />
                Use in chat
              </Link>
            </Button>
          </div>

          <div className="mb-6 rounded-2xl border border-wrong-soft bg-wrong-soft/35 p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-wrong" />
              <p className="text-small leading-relaxed text-ink-muted">
                Educational use only. These cards teach recognition and escalation language for synthetic scenarios. They are not real-patient guidance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {DO_NOT_MISS.map((entry, index) => (
              <DoNotMissCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>

          <p className="mt-8 text-center text-micro text-ink-muted">
            Local demo content | all content synthetic | needs faculty verification before pilot use
          </p>
        </div>
      </div>
    </ChatLayout>
  )
}
