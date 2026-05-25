import Link from "next/link"
import { ArrowUpRight, ChevronDown, MessageSquare, ShieldAlert, TriangleAlert } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DO_NOT_MISS, MISTAKE_MUSEUM } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Common pitfalls",
  description:
    "Decision-time reasoning errors in hand surgery. Each entry shows the mistake, why learners make it, why it matters, and how to avoid it.",
}

function PitfallCard({ entry, index }: {
  entry: typeof MISTAKE_MUSEUM[number]
  index: number
}) {
  const linkedRedFlag = entry.relatedDoNotMissId
    ? DO_NOT_MISS.find((d) => d.id === entry.relatedDoNotMissId)
    : undefined

  return (
    <article className="overflow-hidden rounded-2xl border border-rule bg-bg-elevated transition-shadow duration-200 ease-standard hover:shadow-medium">
      <header className="flex items-start gap-3 px-5 pt-5">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-warn-soft font-mono text-[11px] font-semibold text-warn">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-warn">
            Reasoning error
          </p>
          <h2 className="font-fraunces text-h3 text-ink heading-readable">{entry.title}</h2>
          {entry.vignette && (
            <p className="mt-2 text-small italic leading-relaxed text-ink-muted">
              {entry.vignette}
            </p>
          )}
        </div>
      </header>

      <div className="px-5 pt-4">
        <div className="rounded-xl bg-warn-soft/40 px-4 py-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-warn">
            The pitfall
          </p>
          <p className="text-small leading-relaxed text-ink">{entry.mistake}</p>
        </div>
      </div>

      <details className="group/details mt-3 px-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-small font-medium text-ink-muted transition-colors duration-150 ease-standard hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric">
          <span>Why it happens, why it matters, how to avoid</span>
          <ChevronDown size={13} className="transition-transform duration-200 ease-standard group-open/details:rotate-180" />
        </summary>
        <div className="mt-3 grid gap-3">
          {[
            { label: "Why learners make it", value: entry.whyLearnersMakeIt },
            { label: "Why it matters",       value: entry.whyItMatters },
            { label: "How to avoid it",      value: entry.howToAvoidIt },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-bg px-4 py-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                {label}
              </p>
              <p className="text-small leading-relaxed text-ink">{value}</p>
            </div>
          ))}
        </div>
      </details>

      <div className="mx-5 my-4 rounded-xl bg-terracotta-soft/40 px-4 py-3">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-terracotta">
          Round-ready correction
        </p>
        <p className="text-small font-medium italic leading-relaxed text-ink">
          &ldquo;{entry.bestCorrectionOneLiner}&rdquo;
        </p>
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
            <Link href={`/c?prefill=${encodeURIComponent(`Quiz me on this pitfall: ${entry.title}`)}`}>
              <MessageSquare size={13} />
              Quiz me
            </Link>
          </Button>
        </div>

        {linkedRedFlag && (
          <Link
            href={`/donotmiss#${linkedRedFlag.id}`}
            className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-rule bg-bg px-3 py-2 text-small text-ink-muted transition-colors duration-150 ease-standard hover:border-wrong-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert size={12} className="text-wrong" />
              <span>
                Related red flag: <span className="font-medium text-ink">{linkedRedFlag.diagnosis}</span>
              </span>
            </span>
            <ArrowUpRight size={12} className="flex-shrink-0 text-ink-faint" />
          </Link>
        )}
      </footer>
    </article>
  )
}

export default function CommonPitfallsPage() {
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
                Common pitfalls
              </h1>
              <p className="mt-3 text-body text-ink-muted prose-readable">
                Reasoning errors that happen <em>after</em> the diagnosis is clear — the wrong-next-step kind.
                Each card pairs the trap with why it happens, what goes wrong, and the one-liner that corrects it on rounds.
              </p>
              <p className="mt-3 text-small text-ink-faint">
                For diagnoses you cannot miss at first contact, see{" "}
                <Link href="/donotmiss" className="text-electric hover:underline">Red flags</Link>.
              </p>
            </div>
            <Button asChild>
              <Link href="/c?prefill=Common%20pitfalls%20in%20hand%20surgery">
                <MessageSquare size={14} />
                Use in chat
              </Link>
            </Button>
          </header>

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-warn-soft bg-warn-soft/35 p-4">
            <TriangleAlert size={16} className="mt-0.5 flex-shrink-0 text-warn" />
            <p className="text-small leading-relaxed text-ink-muted">
              Teaching patterns, not clinical guidance. All content is synthetic. Faculty verification is planned for Phase 0C.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {MISTAKE_MUSEUM.map((entry, index) => (
              <div key={entry.id} id={entry.id}>
                <PitfallCard entry={entry} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
