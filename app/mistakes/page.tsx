import Link from "next/link"
import { ArrowUpRight, ChevronDown, Eye, MessageSquare, TriangleAlert } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DO_NOT_MISS, MISTAKE_MUSEUM } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mistake Museum",
  description:
    "Decision-time cognitive errors in hand surgery. Each entry shows the mistake, why learners make it, why it matters, and how to avoid it.",
}

const FILTERS = ["infection", "tendon", "fracture", "nerve", "emergency"]

function MistakeCard({ entry, index }: {
  entry: typeof MISTAKE_MUSEUM[number]
  index: number
}) {
  const linkedDoNotMiss = entry.relatedDoNotMissId
    ? DO_NOT_MISS.find((d) => d.id === entry.relatedDoNotMissId)
    : undefined

  return (
    <article className="overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-soft transition-all duration-300 ease-standard hover:border-warn-soft hover:shadow-medium">
      <div className="flex items-start gap-3 px-5 pt-5">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-warn-soft font-mono text-micro text-warn">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-1 font-fraunces text-micro font-semibold uppercase tracking-[0.18em] text-warn">
            Decision-time error
          </p>
          <h2 className="font-fraunces text-h3 text-ink">{entry.title}</h2>
          {entry.vignette && (
            <p className="mt-2 text-small italic leading-relaxed text-ink-muted">
              {entry.vignette}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-xl bg-warn-soft/40 px-4 py-3">
          <p className="mb-1 text-micro font-semibold uppercase tracking-[0.16em] text-warn">
            The mistake
          </p>
          <p className="text-small leading-relaxed text-ink">{entry.mistake}</p>
        </div>
      </div>

      <details className="group/details mt-3 px-5">
        <summary
          className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-small font-medium text-ink-muted transition-colors duration-200 ease-standard hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
        >
          <span>Show why it happens, why it matters, how to avoid it</span>
          <ChevronDown size={14} className="transition-transform duration-300 ease-standard group-open/details:rotate-180" />
        </summary>
        <div className="mt-3 grid gap-3">
          {[
            { label: "Why learners make it", value: entry.whyLearnersMakeIt },
            { label: "Why it matters", value: entry.whyItMatters },
            { label: "How to avoid it", value: entry.howToAvoidIt },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-bg px-4 py-3">
              <p className="mb-1 text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">{label}</p>
              <p className="text-small leading-relaxed text-ink">{value}</p>
            </div>
          ))}
        </div>
      </details>

      <div className="mx-5 my-4 rounded-xl border-l-2 border-terracotta bg-terracotta-soft/30 px-4 py-3">
        <p className="mb-1 text-micro font-semibold uppercase tracking-[0.16em] text-terracotta">
          Best correction on rounds
        </p>
        <p className="text-small font-semibold italic leading-relaxed text-ink">
          &ldquo;{entry.bestCorrectionOneLiner}&rdquo;
        </p>
      </div>

      <div className="border-t border-rule/60 bg-bg/60 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
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

        {linkedDoNotMiss && (
          <Link
            href={`/donotmiss#${linkedDoNotMiss.id}`}
            className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-wrong-soft/70 bg-wrong-soft/25 px-3 py-2 text-small text-ink-muted transition-colors duration-200 ease-standard hover:border-wrong-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            <span className="flex items-center gap-2">
              <Eye size={13} className="text-wrong" />
              <span>
                Recognition side: <span className="font-medium text-ink">{linkedDoNotMiss.diagnosis}</span>
              </span>
            </span>
            <ArrowUpRight size={13} className="flex-shrink-0 text-ink-faint" />
          </Link>
        )}
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
              <h1 className="font-fraunces text-h1 text-ink">Decision-time cognitive errors</h1>
              <p className="mt-3 text-body text-ink-muted">
                When the diagnosis was visible but the management decision went wrong. Each card pairs the trap, the cognitive reason behind it, the clinical consequence, and the one-liner that corrects it on rounds.
              </p>
              <p className="mt-3 text-micro text-ink-muted">
                For first-contact red flags (what to spot before acting), see <Link href="/donotmiss" className="text-electric hover:underline">Do-Not-Miss</Link>.
              </p>
            </div>
            <Button asChild>
              <Link href="/c?prefill=Common%20decision-time%20mistakes%20in%20hand%20surgery">
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
                These are teaching patterns, not clinical instructions. Faculty verification workflow is planned for Phase 0C. All content is synthetic — no real patient data.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {MISTAKE_MUSEUM.map((entry, index) => (
              <div key={entry.id} id={entry.id}>
                <MistakeCard entry={entry} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
