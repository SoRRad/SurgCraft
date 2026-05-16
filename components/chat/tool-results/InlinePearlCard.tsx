"use client"

interface InlinePearlCardProps {
  topic: string
  pearl_text: string
  attribution: string
}

export function InlinePearlCard({ topic, pearl_text, attribution }: InlinePearlCardProps) {
  return (
    <div className="border-l-[3px] border-terracotta rounded-r-lg bg-terracotta-soft/30 px-4 py-3 my-2">
      <p className="text-micro text-terracotta font-semibold uppercase tracking-wider mb-2">
        Pearl · {topic}
      </p>
      <p className="text-body text-ink leading-relaxed font-medium mb-2">
        &ldquo;{pearl_text}&rdquo;
      </p>
      <p className="text-micro text-ink-muted">{attribution}</p>
    </div>
  )
}
