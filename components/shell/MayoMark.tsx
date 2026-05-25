"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Mayo Clinic logo mark.
 *
 * Loads /mayo-clinic-logo.svg (or .png) from /public. If the asset is
 * missing (404), gracefully falls back to a small inline three-shield
 * glyph so the chip never looks broken.
 *
 * Drop the approved Mayo logo file at: public/mayo-clinic-logo.svg
 * (or public/mayo-clinic-logo.png). The component picks the first
 * one that loads.
 */
interface MayoMarkProps {
  size?: number
  className?: string
  /** Render with "MAYO CLINIC" wordmark next to the shield. */
  withWordmark?: boolean
}

export function MayoMark({ size = 16, className, withWordmark = false }: MayoMarkProps) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <span
        className={cn("inline-flex items-center gap-1.5", className)}
        aria-hidden="true"
        title="Mayo Clinic"
      >
        <ShieldGlyph size={size} />
        {withWordmark && (
          <span className="font-fraunces text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
            Mayo Clinic
          </span>
        )}
      </span>
    )
  }

  return (
    <span className={cn("inline-flex items-center", className)} aria-hidden="true">
      {/* Native <img> avoids next/image's strict 404 behavior and works
          for any approved asset (SVG / PNG) the user drops in /public. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mayo-clinic-logo.svg"
        alt=""
        width={withWordmark ? size * 5 : size}
        height={size}
        className="object-contain"
        onError={(e) => {
          // Try .png if .svg missing
          const el = e.currentTarget
          if (el.dataset.fallback === "png") {
            setErrored(true)
            return
          }
          el.dataset.fallback = "png"
          el.src = "/mayo-clinic-logo.png"
        }}
      />
    </span>
  )
}

/** Tiny three-shield glyph used when the official logo file is missing. */
function ShieldGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink"
      aria-hidden="true"
    >
      <path d="M4 4h6v8a3 3 0 0 1-3 3 3 3 0 0 1-3-3z" />
      <path d="M14 4h6v8a3 3 0 0 1-3 3 3 3 0 0 1-3-3z" />
      <path d="M9 11h6v8a3 3 0 0 1-3 3 3 3 0 0 1-3-3z" />
    </svg>
  )
}
