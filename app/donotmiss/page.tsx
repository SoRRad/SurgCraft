import Link from "next/link"
import { ArrowUpRight, ChevronDown, Eye, MessageSquare, ShieldAlert, TriangleAlert } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DO_NOT_MISS, MISTAKE_MUSEUM } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Do-Not-Miss",
  description:
    "Recognition-time red flags in hand surgery — high-stakes diagnoses where delayed recognition causes irreversible harm.",
}

const CLINICAL_CALLOUT =
  "For real patients, escalate to your senior resident and attending. ORION is not for clinical decisions."

function DoNotMissCard({ entry, index }: {
  entry: typeof DO_NOT_MISS[number]
  index: number
}) {
  const linkedMistake = entry.relatedMistakeId
    ? MISTAKE_MUSEUM.find((m) => m.id === entry.relatedMistakeId)
    : undefined

  return (
    <article className="overflow-hidden rounded-2xl border border-wrong-soft bg-bg-elevated shadow-soft transition-all duration-300 ease-standard hover:shadow-medium">
      <div className="flex items-start gap-3 border-b border-wrong-soft/60 bg-wrong-soft/20 px-5 py-4">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-wrong-soft font-mono text-micro text-wrong">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-micro font-semibold uppercase tracking-[0.18em] text-wrong">
            Recognition-time red flag
          </p>
          <h2 className="font-fraunces text-h3 leading-tight text-ink">{entry.diagnosis}</h2>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-xl bg-wrong-soft/35 px-4 py-3">
          <p className="mb-1 text-micro font-semibold uppercase tracking-[0.16em] text-wrong">
            Recognition clue
          </p>
          <p className="text-small leading-relaxed text-ink">{entry.clue}</p>
        </div>
      </div>

      <details className="group/details mt-3 px-5">
        <summary
          className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-small font-medium text-ink-muted transition-colors duration-200 ease-standard hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
        >
          <span>Show what happens if missed and educational point</span>
          <ChevronDown size={14} className="transition-transform duration-300 ease-standard group-open/details:rotate-180" />
        </summary>
        <div className="mt-3 grid gap-3">
          <div className="rounded-xl bg-bg px-4 py-3">
            <p className="mb-1 text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">If missed</p>
            <p className="text-small leading-relaxed text-ink">{entry.badOutcome}</p>
          </div>
          <div className="rounded-xl bg-bg px-4 py-3">
            <p className="mb-1 text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">Educational point</p>
            <p className="text-small leading-relaxed text-ink">{entry.educationalPoint}</p>
          </div>
        </div>
      </details>

      <div className="mx-5 my-4 rounded-xl border-l-2 border-wrong bg-wrong-soft/35 px-4 py-3" role="note">
        <p className="text-small italic leading-relaxed text-ink-muted">{CLINICAL_CALLOUT}</p>
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
            <Link href={`/c?prefill=${encodeURIComponent(`Quiz me on do-not-miss diagnosis: ${entry.diagnosis}`)}`}>
              <MessageSquare size={14} />
              Quiz me
            </Link>
          </Button>
        </div>

        {linkedMistake && (
          <Link
            href={`/mistakes#${linkedMistake.id}`}
            className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-warn-soft/70 bg-warn-soft/30 px-3 py-2 text-small text-ink-muted transition-colors duration-200 ease-standard hover:border-warn-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            <span className="flex items-center gap-2">
              <TriangleAlert size={13} className="text-warn" />
              <span>
                Decision side: <span className="font-medium text-ink">{linkedMistake.title}</span>
              </span>
            </span>
            <ArrowUpRight size={13} className="flex-shrink-0 text-ink-faint" />
          </Link>
        )}
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
              <h1 className="font-fraunces text-h1 text-ink">Recognition-time red flags</h1>
              <p className="mt-3 text-body text-ink-muted">
                What to spot at first contact, when missing it can cause irreversible harm. Each card teaches the recognition clue, the catastrophic outcome of delay, and the educational anchor that drives the escalation reflex.
              </p>
              <p className="mt-3 text-micro text-ink-muted">
                For management-time errors after the diagnosis was visible, see the <Link href="/mistakes" className="text-electric hover:underline">Mistake Museum</Link>.
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
                Educational use only. These cards teach recognition and escalation language for synthetic scenarios. They are not real-patient guidance. Faculty verification workflow is planned for Phase 0C.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {DO_NOT_MISS.map((entry, index) => (
              <div key={entry.id} id={entry.id}>
                <DoNotMissCard entry={entry} index={index} />
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-micro text-ink-muted">
            Local demo content · all content synthetic · needs faculty verification before pilot use
          </p>
        </div>
      </div>
    </ChatLayout>
  )
}
