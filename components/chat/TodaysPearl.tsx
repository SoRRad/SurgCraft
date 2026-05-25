"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { PEARLS } from "@/lib/demo/demo-content"
import { cn } from "@/lib/utils"

/**
 * Today's Pearl — surfaces one rotating pearl on the chat empty state.
 *
 * Rotation key is the day-of-year so the same pearl appears all day in any
 * single tab and rotates predictably across days. Client-only to avoid
 * server/client time mismatch flicker.
 */
export function TodaysPearl({ className }: { className?: string }) {
  const [pearl, setPearl] = useState<(typeof PEARLS)[number] | null>(null)

  useEffect(() => {
    if (PEARLS.length === 0) return
    const dayOfYear = Math.floor(Date.now() / 86_400_000)
    setPearl(PEARLS[dayOfYear % PEARLS.length])
  }, [])

  if (!pearl) return null

  return (
    <aside
      className={cn(
        "rounded-2xl border border-terracotta-soft/70 bg-terracotta-soft/25 p-4 text-left shadow-soft",
        className,
      )}
      aria-label="Today's pearl"
    >
      <div className="mb-2 flex items-center gap-2">
        <Sparkles size={13} className="text-terracotta" />
        <span className="font-fraunces text-micro font-semibold uppercase tracking-[0.18em] text-terracotta">
          Today&apos;s pearl · {pearl.topic}
        </span>
      </div>
      <p className="text-body italic leading-relaxed text-ink">
        &ldquo;{pearl.text}&rdquo;
      </p>
      <p className="mt-2 text-micro text-ink-muted">{pearl.attribution}</p>
    </aside>
  )
}
