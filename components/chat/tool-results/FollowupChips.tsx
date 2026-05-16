"use client"

import { cn } from "@/lib/utils"

interface FollowupChipsProps {
  chips: string[]
  onChipClick: (chip: string) => void
}

export function FollowupChips({ chips, onChipClick }: FollowupChipsProps) {
  if (!chips?.length) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onChipClick(chip)}
          className={cn(
            "px-3 py-1.5 rounded-full border border-rule bg-bg text-small text-ink-muted",
            "hover:border-electric hover:text-electric hover:bg-electric-soft/30",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
          )}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
