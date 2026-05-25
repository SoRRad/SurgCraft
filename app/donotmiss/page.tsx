import Link from "next/link"
import { AlertTriangle, ArrowUpRight, ChevronDown, MessageSquare, ShieldAlert } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DO_NOT_MISS, MISTAKE_MUSEUM } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Red flags",
  description:
    "Recognition-time red flags in hand surgery — high-stakes diagnoses where delayed recognition causes irreversible harm.",
}

const CLINICAL_CALLOUT =
  "For real patients, escalate to your senior and attending. ORION is not for clinical decisions."

function RedFlagCard({ entry, index }: {
  entry: typeof DO_NOT_MISS[number]
  index: number
}) {
  const linkedPitfall = entry.relatedMistakeId
    ? MISTAKE_MUSEUM.find((m) => m.id === entry.relatedMistakeId)
    : undefined

  return (
    <article className="overflow-hidden rounded-2xl border border-wrong-soft bg-bg-elevated transition-shadow duration-200 ease-standard hover:shadow-medium">
      <header className="flex items-start gap-3 border-b border-wrong-soft/60 bg-wrong-soft/25 px-5 py-4">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-wrong-soft font-mono text-[11px] font-semibold text-wrong">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-wrong">
            Do not miss
          </p>
          <h2 className="font-fraunces text-h3 leading-tight text-ink heading-readable">
            {entry.diagnosis}
          </h2>
        </div>
      </header>

      <div className="px-5 pt-4">
        <div className="rounded-xl bg-wrong-soft/30 px-4 py-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-wrong">
            Recognition clue
          </p>
          <p className="text-small leading-relaxed text-ink">{entry.clue}</p>
        </div>
      </div>

      <details className="group/details mt-3 px-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-small font-medium text-ink-muted transition-colors duration-150 ease-standard hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric">
          <span>If missed, and the teaching point</span>
          <ChevronDown size={13} className="transition-transform duration-200 ease-standard group-open/details:rotate-180" />
        </summary>
        <div className="mt-3 grid gap-3">
          <div className="rounded-xl bg-bg px-4 py-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              If missed
            </p>
            <p className="text-small leading-relaxed text-ink">{entry.badOutcome}</p>
          </div>
          <div className="rounded-xl bg-bg px-4 py-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Teaching point
            </p>
            <p className="text-small leading-relaxed text-ink">{entry.educationalPoint}</p>
          </div>
        </div>
      </details>

      <div className="mx-5 my-4 rounded-xl bg-wrong-soft/30 px-4 py-3" role="note">
        <p className="text-small italic leading-relaxed text-ink-muted">{CLINICAL_CALLOUT}</p>
      </div>

      <footer className="border-t border-rule/60 bg-bg/40 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-surface-subtle text-ink-muted">
                {tag}
              </Badge>
            ))}
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/c?prefill=${encodeURIComponent(`Quiz me on this red flag: ${entry.diagnosis}`)}`}>
              <MessageSquare size={13} />
              Quiz me
            </Link>
          </Button>
        </div>

        {linkedPitfall && (
          <Link
            href={`/mistakes#${linkedPitfall.id}`}
            className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-rule bg-bg px-3 py-2 text-small text-ink-muted transition-colors duration-150 ease-standard hover:border-warn-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            <span className="flex items-center gap-2">
              <AlertTriangle size={12} className="text-warn" />
              <span>
                Related pitfall: <span className="font-medium text-ink">{linkedPitfall.title}</span>
              </span>
            </span>
            <ArrowUpRight size={12} className="flex-shrink-0 text-ink-faint" />
          </Link>
        )}
      </footer>
    </article>
  )
}

export default function RedFlagsPage() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Learn
              </p>
              <h1 className="mt-1.5 font-fraunces text-h1 text-ink heading-readable">
                Red flags
              </h1>
              <p className="mt-3 text-body text-ink-muted prose-readable">
                Presentations you cannot miss at first contact — where a missed diagnosis causes irreversible harm.
                Each card pairs the recognition clue with the consequence of delay and the teaching anchor that drives the escalation reflex.
              </p>
              <p className="mt-3 text-small text-ink-faint">
                For decision errors after the diagnosis is visible, see{" "}
                <Link href="/mistakes" className="text-electric hover:underline">Common pitfalls</Link>.
              </p>
            </div>
            <Button asChild>
              <Link href="/c?prefill=Walk%20me%20through%20red%20flags%20in%20hand%20surgery">
                <ShieldAlert size={14} />
                Use in chat
              </Link>
            </Button>
          </header>

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-wrong-soft bg-wrong-soft/30 p-4">
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0 text-wrong" />
            <p className="text-small leading-relaxed text-ink-muted">
              Educational use only. Synthetic teaching cards, not real-patient guidance. Faculty verification is planned for Phase 0C.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {DO_NOT_MISS.map((entry, index) => (
              <div key={entry.id} id={entry.id}>
                <RedFlagCard entry={entry} index={index} />
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-micro text-ink-faint">
            Local demo content · synthetic · awaiting faculty review
          </p>
        </div>
      </div>
    </ChatLayout>
  )
}
