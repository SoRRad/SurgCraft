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
    <div className="border border-rule rounded-lg bg-bg-elevated overflow-hidden my-2">
      <div className="px-4 py-3 border-b border-rule bg-bg flex items-center gap-2">
        <AlertTriangle size={14} className="text-warn flex-shrink-0" />
        <p className="text-micro text-warn font-semibold uppercase tracking-wider">
          Common mistake
        </p>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div>
          <p className="text-small font-medium text-ink">{entry.title}</p>
          <p className="text-small text-ink-muted mt-0.5">{entry.mistake}</p>
        </div>
        <div>
          <p className="text-micro text-ink-muted uppercase tracking-wider mb-1">Why it matters</p>
          <p className="text-small text-ink leading-relaxed">{entry.whyItMatters}</p>
        </div>
        <div className="border-l-[3px] border-terracotta pl-3">
          <p className="text-small text-ink font-medium italic">
            &ldquo;{entry.bestCorrectionOneLiner}&rdquo;
          </p>
        </div>
        <Link
          href="/mistakes"
          className="inline-block text-micro text-electric hover:underline"
        >
          See all mistakes in Mistake Museum →
        </Link>
        {!entry.verified && (
          <p className="text-micro text-ink-muted">
            Local demo content · needs faculty verification
          </p>
        )}
      </div>
    </div>
  )
}
