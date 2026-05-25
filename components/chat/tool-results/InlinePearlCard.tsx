"use client"

interface PearlEntry {
  id: string
  topic: string
  content: string
  attribution: string
  verified?: boolean
}

interface InlinePearlCardProps {
  entry: PearlEntry | null
}

export function InlinePearlCard({ entry }: InlinePearlCardProps) {
  if (!entry) return null

  return (
    <div className="border-l-[3px] border-terracotta rounded-r-lg bg-terracotta-soft/30 px-4 py-3 my-2">
      <p className="text-micro text-terracotta font-semibold uppercase tracking-wider mb-2">
        Pearl · {entry.topic}
      </p>
      <p className="text-body text-ink leading-relaxed font-medium mb-2">
        &ldquo;{entry.content}&rdquo;
      </p>
      <p className="text-micro text-ink-muted">{entry.attribution}</p>
      {!entry.verified && (
        <p className="text-micro text-ink-muted mt-2">
          Local demo content · needs faculty verification
        </p>
      )}
    </div>
  )
}
