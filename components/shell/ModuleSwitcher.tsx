"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, CircleDashed, CircleDot, Grid3x3 } from "lucide-react"
import { DEFAULT_MODULE, MODULES, type SurgicalModule } from "@/lib/orion/modules"
import { cn } from "@/lib/utils"

interface ModuleSwitcherProps {
  /** The id of the currently active module surface. Defaults to "hand". */
  currentModuleId?: string
  /** Compact rendering for header use vs full-width for sidebar use. */
  variant?: "header" | "sidebar"
}

/**
 * A compact dropdown that shows the current ORION module and lets learners
 * jump between modules. Active modules route to their home; in-development
 * modules route to /m/[id] placeholder pages.
 */
export function ModuleSwitcher({
  currentModuleId = DEFAULT_MODULE.id,
  variant = "header",
}: ModuleSwitcherProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const current = MODULES.find((m) => m.id === currentModuleId) ?? DEFAULT_MODULE

  // Click-outside + Escape to close
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const triggerLabel = variant === "header" ? current.name : `Module · ${current.name}`

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Switch module. Currently ${current.fullName}.`}
        title={`Switch module — currently ${current.fullName}`}
        className={cn(
          variant === "header"
            ? "hidden items-center gap-1.5 rounded-full bg-surface-subtle px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.18em] text-ink-muted transition-colors duration-300 ease-standard hover:text-ink sm:inline-flex"
            : "flex w-full items-center justify-between gap-2 rounded-xl border border-rule/70 bg-bg-elevated px-3 py-2 text-small text-ink shadow-soft",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2",
        )}
      >
        <span>{triggerLabel}</span>
        <ChevronDown size={12} className={cn("transition-transform duration-200 ease-standard", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Module switcher"
          className={cn(
            "absolute right-0 z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-floating",
            "animate-fade-up",
            variant === "sidebar" && "left-0 right-auto",
          )}
        >
          <div className="border-b border-rule/70 bg-surface-subtle/60 px-4 py-2.5">
            <p className="font-fraunces text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">
              ORION modules
            </p>
            <p className="mt-0.5 text-micro text-ink-muted">
              Switch surgical subspecialty
            </p>
          </div>

          <ul className="max-h-[60vh] divide-y divide-rule/40 overflow-y-auto">
            {MODULES.map((m) => (
              <li key={m.id}>
                <ModuleSwitchItem
                  module={m}
                  isCurrent={m.id === current.id}
                  onSelect={() => setOpen(false)}
                />
              </li>
            ))}
          </ul>

          <div className="border-t border-rule/70 px-3 py-2">
            <Link
              href="/modules"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-micro text-ink-muted transition-colors duration-200 ease-standard hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              <Grid3x3 size={12} />
              View all modules
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

interface ModuleSwitchItemProps {
  module: SurgicalModule
  isCurrent: boolean
  onSelect: () => void
}

function ModuleSwitchItem({ module, isCurrent, onSelect }: ModuleSwitchItemProps) {
  const Icon = module.icon
  const href = module.homeRoute ?? `/m/${module.id}`
  const isActive = module.status === "active"
  const statusLabel = isActive
    ? "Active"
    : module.status === "in-development"
      ? "In development"
      : "Planned"

  return (
    <Link
      role="menuitem"
      href={href}
      onClick={onSelect}
      className={cn(
        "flex items-start gap-3 px-4 py-3 text-left transition-colors duration-200 ease-standard",
        "hover:bg-surface-subtle focus-visible:bg-surface-subtle focus-visible:outline-none",
        isCurrent && "bg-electric-soft/40",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
          isActive ? "bg-terracotta-soft text-terracotta" : "bg-surface-subtle text-ink-faint",
        )}
        aria-hidden="true"
      >
        <Icon size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-small font-semibold text-ink">{module.name}</span>
          {isActive ? (
            <CircleDot size={10} className="text-correct" aria-hidden="true" />
          ) : (
            <CircleDashed size={10} className="text-ink-faint" aria-hidden="true" />
          )}
          <span className="text-micro text-ink-faint">{statusLabel}</span>
        </span>
        <span className="mt-0.5 block text-micro leading-snug text-ink-muted">
          {module.tagline}
        </span>
      </span>
    </Link>
  )
}
