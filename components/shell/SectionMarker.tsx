import { cn } from "@/lib/utils"

interface SectionMarkerProps {
  number: string | number
  label: string
  className?: string
}

export function SectionMarker({ number, label, className }: SectionMarkerProps) {
  const num = String(number).padStart(2, "0")
  return (
    <div
      className={cn(
        "flex items-baseline gap-2 font-inter text-micro font-semibold tracking-[0.18em] uppercase text-terracotta",
        className
      )}
    >
      <span aria-hidden="true">No.</span>
      <span>{num}</span>
      <span aria-hidden="true">/</span>
      <span>{label}</span>
    </div>
  )
}
