"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Tutor" },
  { href: "/case", label: "Cases" },
  { href: "/mistakes", label: "Mistakes" },
  { href: "/donotmiss", label: "Do-Not-Miss" },
  { href: "/about", label: "About" },
]

export function Header({ className }: HeaderProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header className={cn("sticky top-0 z-40 border-b border-rule bg-bg", className)}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 gap-4">

        {/* Wordmark */}
        <Link
          href="/"
          className="flex flex-col gap-0.5 group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 rounded"
          aria-label="SurgiCraft: Handcraft — go to home"
        >
          <span className="text-micro text-ink-muted tracking-wider uppercase font-inter leading-none">
            SurgiCraft
          </span>
          <span className="font-fraunces text-h2 font-semibold text-ink group-hover:text-terracotta transition-colors duration-150 leading-tight">
            Handcraft
          </span>
        </Link>

        {/* Phase badges — hidden on small screens */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <Badge variant="secondary" className="text-micro">Phase 0A</Badge>
          <Badge variant="outline" className="text-micro text-ink-muted">No AI API</Badge>
        </div>

        {/* Nav */}
        <nav
          className="flex items-center gap-1 overflow-x-auto"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-2 py-1 rounded text-small whitespace-nowrap transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2",
                isActive(href)
                  ? "text-ink font-medium underline decoration-electric underline-offset-4 decoration-[1.5px]"
                  : "text-ink-muted hover:text-ink"
              )}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

      </div>
    </header>
  )
}
