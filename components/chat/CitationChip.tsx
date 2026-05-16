"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface CitationChipProps {
  source: string
  year: string
  full?: string
}

export function CitationChip({ source, year, full }: CitationChipProps) {
  const [open, setOpen] = useState(false)
  const label = `${source}, ${year}`
  const tooltip = full ?? label

  return (
    <span className="relative inline-block align-baseline">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cn(
          "inline-flex items-center px-1.5 py-0.5 rounded-full mx-0.5",
          "bg-terracotta-soft text-terracotta",
          "text-[12px] leading-tight font-medium font-inter",
          "cursor-default select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-1"
        )}
        aria-label={`Citation: ${tooltip}`}
      >
        {label}
      </button>

      {open && (
        <span
          className={cn(
            "absolute z-50 bottom-full left-0 mb-1.5",
            "px-2.5 py-2 rounded-md shadow-lg",
            "bg-ink text-bg text-micro max-w-[260px] w-max whitespace-normal leading-snug",
            "pointer-events-none"
          )}
        >
          {tooltip}
        </span>
      )}
    </span>
  )
}
