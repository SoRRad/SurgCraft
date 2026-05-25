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
    <div className="border border-wrong-soft rounded-lg overflow-hidden my-2">
      <div className="px-4 py-3 border-b border-wrong-soft bg-wrong-soft/40 flex items-center gap-2">
        <Eye size={14} className="text-wrong flex-shrink-0" />
        <p className="text-micro text-wrong font-semibold uppercase tracking-wider">
          Do not miss
        </p>
      </div>
      <div className="px-4 py-3 space-y-3 bg-bg-elevated">
        <p className="font-fraunces text-h3 text-terracotta">{entry.diagnosis}</p>
        <div>
          <p className="text-micro text-ink-muted uppercase tracking-wider mb-1">The clue</p>
          <p className="text-small text-ink leading-relaxed">{entry.clue}</p>
        </div>
        <div>
          <p className="text-micro text-ink-muted uppercase tracking-wider mb-1">If missed</p>
          <p className="text-small text-ink leading-relaxed">{entry.badOutcome}</p>
        </div>
        <div className="border border-wrong-soft bg-wrong-soft/30 rounded px-3 py-2">
          <p className="text-small text-ink-muted italic">
            In a real clinical scenario, escalate immediately to your senior and hand surgery. Never rely on this app for clinical decisions.
          </p>
        </div>
        {!entry.verified && (
          <p className="text-micro text-ink-muted">
            Local demo content · needs faculty verification
          </p>
        )}
      </div>
    </div>
  )
}
