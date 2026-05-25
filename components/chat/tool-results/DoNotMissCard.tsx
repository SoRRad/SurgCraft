"use client"

import { Eye } from "lucide-react"

interface DoNotMissEntry {
  id: string
  diagnosis: string
  clue: string
  badOutcome: string
  educationalPoint: string
  verified?: boolean
}

interface DoNotMissCardProps {
  entry: DoNotMissEntry | null
}

export function DoNotMissCard({ entry }: DoNotMissCardProps) {
  if (!entry) return null

  return (
    <div className="my-2 overflow-hidden rounded-2xl border border-wrong-soft bg-bg-elevated shadow-soft">
      <div className="flex items-center gap-2 border-b border-wrong-soft bg-wrong-soft/40 px-4 py-3">
        <Eye size={14} className="flex-shrink-0 text-wrong" />
        <p className="text-micro font-semibold uppercase tracking-[0.16em] text-wrong">
          Do not miss
        </p>
      </div>
      <div className="space-y-3 px-4 py-3">
        <p className="font-fraunces text-h3 text-ink">{entry.diagnosis}</p>
        <div>
          <p className="mb-1 text-micro uppercase tracking-wider text-ink-muted">The clue</p>
          <p className="text-small leading-relaxed text-ink">{entry.clue}</p>
        </div>
        <div>
          <p className="mb-1 text-micro uppercase tracking-wider text-ink-muted">If missed</p>
          <p className="text-small leading-relaxed text-ink">{entry.badOutcome}</p>
        </div>
        <div className="rounded-xl border border-wrong-soft bg-wrong-soft/35 px-3 py-2">
          <p className="text-small italic text-ink-muted">
            In a real clinical scenario, escalate immediately to your senior and hand surgery. Never rely on this app for clinical decisions.
          </p>
        </div>
        {!entry.verified && (
          <p className="text-micro text-ink-muted">
            Local demo content | needs faculty verification
          </p>
        )}
      </div>
    </div>
  )
}
