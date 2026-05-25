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

export function Header({ className, onMenuClick }: HeaderProps) {
  const { status } = useProviderStatus()
  const providerLabel = getProviderStatusLabel(status)

  return (
    <header className={cn("sticky top-0 z-40 flex-shrink-0 border-b border-rule/70 bg-bg/95 backdrop-blur", className)}>
      <div className="flex items-center gap-3 px-4 py-3 md:px-5">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-ink-muted transition-all duration-300 ease-standard hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <Link
          href="/c"
          className="group flex min-w-0 flex-shrink-0 items-baseline gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
          aria-label="SurgiCraft: Handcraft, go to chat"
        >
          <span className="font-fraunces text-h3 font-semibold leading-none text-ink transition-colors duration-300 ease-standard group-hover:text-terracotta sm:text-h2">
            SurgiCraft
          </span>
          <span className="hidden rounded-full bg-surface-subtle px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.16em] text-ink-muted sm:inline-flex">
            Handcraft
          </span>
        </Link>

        <div className="flex-1" />

        <div className="hidden items-center gap-2 rounded-full bg-surface-subtle px-3 py-1.5 text-micro font-medium text-ink-muted md:flex">
          <ShieldCheck size={13} className="text-correct" />
          Educational only | No PHI
        </div>

        <Badge
          variant="secondary"
          className={cn(
            "hidden border px-3 py-1 text-micro sm:inline-flex",
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

        <Link
          href="/about"
          className="rounded-lg px-2 py-1 text-small text-ink-muted transition-colors duration-300 ease-standard hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
        >
          About
        </Link>
      </div>
    </header>
  )
}
