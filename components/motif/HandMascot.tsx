import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Pose = "open" | "ok" | "fist" | "pointing"

interface HandMascotProps {
  pose?: Pose
  className?: string
  size?: number
  "aria-label"?: string
}

// Placeholder SVG paths per pose - single-weight line art, terracotta
const paths: Record<Pose, ReactNode> = {
  open: (
    <>
      {/* Palm */}
      <path d="M35 85 C28 85 22 79 22 70 L22 52" />
      <path d="M65 85 C72 85 78 79 78 70 L78 52" />
      <path d="M35 85 Q50 96 65 85" />
      {/* Index finger */}
      <path d="M30 52 Q30 28 34 14 Q38 28 38 52" />
      {/* Middle finger */}
      <path d="M38 52 Q38 22 42 8 Q46 22 46 52" />
      {/* Ring finger */}
      <path d="M46 52 Q46 26 50 14 Q54 26 54 52" />
      {/* Pinky */}
      <path d="M54 52 Q54 32 58 20 Q62 32 62 52" />
      {/* Thumb */}
      <path d="M30 72 Q18 64 10 50 Q20 46 30 58" />
      {/* Knuckle hints */}
      <path d="M32 52 L35 54" strokeWidth="1.5" />
      <path d="M40 52 L43 54" strokeWidth="1.5" />
      <path d="M48 52 L51 54" strokeWidth="1.5" />
      <path d="M56 52 L59 54" strokeWidth="1.5" />
    </>
  ),
  ok: (
    <>
      {/* Stub - implement in Week 6 polish */}
      <circle cx="50" cy="60" r="18" />
      <path d="M62 48 Q75 30 78 16" />
      <path d="M68 54 Q82 42 84 28" />
      <path d="M68 62 Q84 56 86 44" />
    </>
  ),
  fist: (
    <>
      {/* Stub - implement in Week 6 polish */}
      <rect x="24" y="42" width="52" height="38" rx="10" />
      <path d="M24 52 Q18 48 18 40 Q18 32 26 30" />
      <path d="M34 42 L34 38" />
      <path d="M44 42 L44 36" />
      <path d="M54 42 L54 36" />
      <path d="M64 42 L64 38" />
    </>
  ),
  pointing: (
    <>
      {/* Stub - implement in Week 6 polish */}
      <path d="M34 70 Q28 70 24 64 L24 52" />
      <path d="M66 70 Q72 70 76 64 L76 52" />
      <path d="M34 70 Q50 80 66 70" />
      <path d="M38 52 Q38 22 42 6 Q46 22 46 52" />
      <path d="M30 52 L38 52" />
      <path d="M46 52 Q46 44 54 44 L54 52" />
      <path d="M54 52 Q54 46 62 46 L62 52" />
      <path d="M62 52 Q62 48 68 48 L68 52" />
    </>
  ),
}

export function HandMascot({
  pose = "open",
  className,
  size = 120,
  "aria-label": ariaLabel,
}: HandMascotProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      stroke="var(--terracotta)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={ariaLabel ?? `Hand illustration - ${pose} pose`}
      role="img"
      className={cn("select-none", className)}
    >
      {paths[pose]}
    </svg>
  )
}

