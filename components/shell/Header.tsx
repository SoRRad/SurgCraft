import Link from "next/link"
import { Badge } from "@/components/ui/badge"
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

        {/* Wordmark — SurgiCraft eyebrow + Handcraft main */}
        <Link
          href="/"
          className="flex flex-col gap-0.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 rounded"
          aria-label="SurgiCraft: Handcraft — go to home"
        >
          <span className="text-micro text-ink-muted tracking-wider uppercase font-inter leading-none">
            SurgiCraft
          </span>
          <span
            className="font-fraunces text-h2 font-semibold text-ink group-hover:text-terracotta transition-colors duration-150 leading-tight"
          >
            Handcraft
          </span>
        </Link>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="secondary" className="text-micro">
            Handcraft module · Phase 0A
          </Badge>
          <Badge variant="outline" className="text-micro text-ink-muted">
            Demo mode · No AI API
          </Badge>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-4" aria-label="Main navigation">
          <Link
            href="/dashboard"
            className="text-small text-ink-muted hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 rounded"
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className="text-small text-ink-muted hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 rounded"
          >
            About
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
