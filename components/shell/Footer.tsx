import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-rule bg-bg",
        "px-6 py-4",
        className
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-micro text-ink-muted italic font-medium">
          Educational use only. Not for clinical decision-making.
        </p>
        <p className="text-micro text-ink-muted">
          SurgiCraft: Handcraft · Mayo Clinic Pilot · Phase 0A
        </p>
      </div>
    </footer>
  )
}
