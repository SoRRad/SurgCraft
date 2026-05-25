"use client"

import Link from "next/link"
import { Menu, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getProviderStatusLabel, useProviderStatus } from "./useProviderStatus"

interface HeaderProps {
  className?: string
  onMenuClick?: () => void
}

/**
 * Compact, sticky header. Shows brand + module on mobile only (sidebar
 * carries the brand on md+). PHI pill is always visible. Provider badge
 * is the truth label for which engine is replying.
 */
export function Header({ className, onMenuClick }: HeaderProps) {
  const { status } = useProviderStatus()
  const providerLabel = getProviderStatusLabel(status)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex-shrink-0 border-b border-rule/70 bg-bg/90 backdrop-blur",
        className
      )}
    >
      <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="-ml-1 rounded-lg p-2 text-ink-muted transition-colors duration-200 ease-standard hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        {/* Brand (mobile only — sidebar shows it on md+) */}
        <Link
          href="/c"
          className="group flex min-w-0 items-baseline gap-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 md:hidden"
          aria-label="ORION Surgery"
        >
          <span className="font-fraunces text-[17px] font-semibold uppercase leading-none tracking-[0.14em] text-ink">
            ORION
          </span>
          <span className="font-fraunces text-small text-ink-faint">· Hand</span>
        </Link>

        <div className="flex-1" />

        {/* PHI pill */}
        <span
          className="hidden items-center gap-1.5 rounded-full bg-surface-subtle px-3 py-1 text-[11px] font-medium text-ink-muted sm:inline-flex"
          title="Educational platform. Not for clinical decisions. Do not enter PHI."
        >
          <ShieldCheck size={11} className="text-correct" />
          Educational · No PHI
        </span>

        {/* Provider badge */}
        <Badge
          variant="secondary"
          className={cn(
            "hidden border px-2.5 py-0.5 text-[11px] sm:inline-flex",
            status.provider === "anthropic"
              ? "border-correct-soft bg-correct-soft text-correct"
              : status.reason
                ? "border-warn-soft bg-warn-soft text-warn"
                : "border-rule bg-bg-elevated text-ink-muted"
          )}
          title={status.reason ?? undefined}
        >
          {providerLabel}
        </Badge>
      </div>
    </header>
  )
}
