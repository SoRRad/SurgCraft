"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const isLive = process.env.NEXT_PUBLIC_APP_MODE === "live"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-40 border-b border-rule bg-bg flex-shrink-0", className)}>
      <div className="flex items-center px-4 py-3 gap-3">

        {/* Hamburger — mobile only, sidebar drawer comes in Part 2 */}
        <button
          type="button"
          className="md:hidden p-1.5 -ml-1 rounded text-ink-muted hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        {/* Wordmark → /c */}
        <Link
          href="/c"
          className="flex flex-col gap-0.5 group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 rounded"
          aria-label="SurgiCraft : Handcraft — go to chat"
        >
          <span className="text-micro text-ink-muted tracking-wider uppercase font-inter leading-none">
            SurgiCraft
          </span>
          <span className="font-fraunces text-h2 font-semibold text-ink group-hover:text-terracotta transition-colors duration-150 leading-tight">
            Handcraft
          </span>
        </Link>

        {/* Center spacer */}
        <div className="flex-1" />

        {/* Right: mode badge + About */}
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className={cn(
              "text-micro hidden sm:flex",
              isLive
                ? "bg-correct-soft text-correct border-correct-soft"
                : "text-ink-muted"
            )}
          >
            {isLive ? "Live AI" : "Demo mode"}
          </Badge>

          <Link
            href="/about"
            className="text-small text-ink-muted hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 rounded px-1 whitespace-nowrap"
          >
            About
          </Link>
        </div>

      </div>
    </header>
  )
}
