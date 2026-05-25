import Link from "next/link"
import { MessageSquare, TriangleAlert } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MISTAKE_MUSEUM } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Mistake Museum" }

const FILTERS = ["infection", "tendon", "fracture", "nerve", "emergency"]

function MistakeCard({ entry, index }: {
  entry: typeof MISTAKE_MUSEUM[number]
  index: number
}) {
  return (
    <article className="rounded-2xl border border-rule/70 bg-bg-elevated p-5 shadow-soft transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:border-warn-soft hover:shadow-medium">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-warn-soft font-mono text-micro text-warn">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h2 className="font-fraunces text-h3 text-ink">{entry.title}</h2>
          {entry.vignette && (
            <p className="mt-2 text-small italic leading-relaxed text-ink-muted">
              {entry.vignette}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        {[
          { label: "The mistake", value: entry.mistake, tone: "warn" },
          { label: "Why learners make it", value: entry.whyLearnersMakeIt },
          { label: "Why it matters", value: entry.whyItMatters },
          { label: "How to avoid it", value: entry.howToAvoidIt },
          { label: "Best correction one-liner", value: entry.bestCorrectionOneLiner, quote: true },
        ].map(({ label, value, tone, quote }) => (
          <div key={label} className="rounded-xl bg-bg px-4 py-3">
            <p className={`mb-1 text-micro font-semibold uppercase tracking-[0.16em] ${tone === "warn" ? "text-warn" : "text-ink-faint"}`}>
              {label}
            </p>
            <p className={`text-small leading-relaxed text-ink ${quote ? "font-semibold" : ""}`}>
              {quote ? `"${value}"` : value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-surface-subtle text-ink-muted">
              {tag}
            </Badge>
          ))}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/c?prefill=${encodeURIComponent(`Quiz me on this mistake: ${entry.title}`)}`}>
            <MessageSquare size={14} />
            Quiz me
          </Link>
        </Button>
      </div>
    </article>
  )
}

export default function MistakesPage() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <SectionMarker number="04" label="Mistake Museum" className="mb-3" />
              <h1 className="font-fraunces text-h1 text-ink">Common mistakes in hand surgery</h1>
              <p className="mt-3 text-body text-ink-muted">
                Error patterns attendings correct often, organized by the cognitive trap, consequence, and best correction.
              </p>
              <p className="mt-3 text-micro text-ink-muted">
                Local demo content | all cases synthetic | needs faculty verification
              </p>
            </div>
            <Button asChild>
              <Link href="/c?prefill=Common%20mistakes%20in%20hand%20surgery">
                <MessageSquare size={15} />
                Use in chat
              </Link>
            </Button>
          </div>

          <div className="mb-6 flex flex-wrap gap-2" aria-label="Topic filters">
            {FILTERS.map((filter) => (
              <span key={filter} className="rounded-full border border-rule/70 bg-bg-elevated px-3 py-1 text-small text-ink-muted shadow-[0_1px_1px_rgba(32,32,30,0.03)]">
                {filter}
              </span>
            ))}
          </div>

          <div className="mb-8 rounded-2xl border border-warn-soft bg-warn-soft/35 p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <TriangleAlert size={18} className="mt-0.5 flex-shrink-0 text-warn" />
              <p className="text-small leading-relaxed text-ink-muted">
                These are teaching patterns, not clinical instructions. Faculty verification workflow is planned for Phase 0C.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {MISTAKE_MUSEUM.map((entry, index) => (
              <MistakeCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
