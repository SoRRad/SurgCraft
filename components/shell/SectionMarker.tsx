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
        "flex items-baseline gap-2 font-fraunces text-terracotta",
        "text-small tracking-widest uppercase",
        className
      )}
      style={{ fontVariant: "small-caps" }}
    >
      <span aria-hidden="true">§</span>
      <span>{num}</span>
      <span aria-hidden="true">—</span>
      <span>{label}</span>
    </div>
  )
}
