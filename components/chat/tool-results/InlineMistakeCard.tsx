"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"

interface MistakeEntry {
  id: string
  title: string
  mistake: string
  whyItMatters: string
  bestCorrectionOneLiner: string
  verified?: boolean
}

interface InlineMistakeCardProps {
  entry: MistakeEntry | null
}

export function InlineMistakeCard({ entry }: InlineMistakeCardProps) {
  if (!entry) return null

  return (
    <div className="my-2 overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-soft">
      <div className="flex items-center gap-2 border-b border-rule/70 bg-surface-subtle/60 px-4 py-3">
        <AlertTriangle size={14} className="flex-shrink-0 text-warn" />
        <p className="text-micro font-semibold uppercase tracking-[0.16em] text-warn">
          Common mistake
        </p>
      </div>
      <div className="space-y-3 px-4 py-3">
        <div>
          <p className="text-small font-medium text-ink">{entry.title}</p>
          <p className="mt-0.5 text-small text-ink-muted">{entry.mistake}</p>
        </div>
        <div>
          <p className="mb-1 text-micro uppercase tracking-wider text-ink-muted">Why it matters</p>
          <p className="text-small leading-relaxed text-ink">{entry.whyItMatters}</p>
        </div>
        <div className="rounded-xl border border-terracotta-soft bg-terracotta-soft/35 px-3 py-2">
          <p className="text-small font-medium italic text-ink">
            &ldquo;{entry.bestCorrectionOneLiner}&rdquo;
          </p>
        </div>
        <Link
          href="/mistakes"
          className="inline-block rounded text-micro text-electric hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
        >
          See all mistakes in Mistake Museum
        </Link>
        {!entry.verified && (
          <p className="text-micro text-ink-muted">
            Local demo content | needs faculty verification
          </p>
        )}
      </div>
    </div>
  )
}
