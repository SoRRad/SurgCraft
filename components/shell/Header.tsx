import Link from "next/link"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-rule bg-bg",
        className
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-baseline gap-1.5 group focus-visible:outline-none"
          aria-label="Handcraft — go to home"
        >
          <span
            className="font-fraunces text-h3 font-semibold text-ink group-hover:text-terracotta transition-colors duration-150"
            style={{ fontVariantLigatures: "common-ligatures" }}
          >
            Handcraft
          </span>
          <span className="text-micro text-ink-muted tracking-widest uppercase font-inter">
            beta
          </span>
        </Link>

        {/* Nav — stubs for Week 5 ModeSwitcher */}
        <nav
          className="flex items-center gap-4"
          aria-label="Main navigation"
        >
          <Link
            href="/dashboard"
            className="text-small text-ink-muted hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 rounded"
          >
            Dashboard
          </Link>
          <Link
            href="/onboarding"
            className="text-small text-ink-muted hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 rounded"
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}
