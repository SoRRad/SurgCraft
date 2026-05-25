"use client"

interface PearlEntry {
  id: string
  topic: string
  text: string
  attribution: string
  sourceLabel?: string
  verified?: boolean
}

interface InlinePearlCardProps {
  entry: PearlEntry | null
}

export function InlinePearlCard({ entry }: InlinePearlCardProps) {
  if (!entry) return null

  return (
    <div className="my-2 rounded-2xl border border-terracotta-soft bg-terracotta-soft/35 px-4 py-3 shadow-soft">
      <p className="mb-2 text-micro font-semibold uppercase tracking-[0.16em] text-terracotta">
        Pearl | {entry.topic}
      </p>
      <p className="mb-2 text-body font-medium leading-relaxed text-ink">
        &ldquo;{entry.text}&rdquo;
      </p>
      <p className="text-micro text-ink-muted">
        {entry.attribution}
        {entry.sourceLabel ? ` | ${entry.sourceLabel}` : ""}
      </p>
      {entry.verified ? (
        <p className="mt-2 text-micro text-correct">
          Faculty verified
        </p>
      ) : (
        <p className="mt-2 text-micro text-ink-muted">
          Local demo content | needs faculty verification
        </p>
      )}
    </div>
  )
}
