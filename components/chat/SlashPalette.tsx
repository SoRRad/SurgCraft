"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { BookOpen, Eye, MessageSquare, Sparkles, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

export type SlashCommand = {
  /** The slash trigger, e.g. "/case". */
  trigger: string
  label: string
  description: string
  icon: typeof MessageSquare
  /** Build the natural-language prompt sent to the chat from the user's argument. */
  build: (argument: string) => string
}

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    trigger: "/case",
    label: "Work through a case",
    description: "Launches a case walkthrough (fight bite, mallet finger, distal radius).",
    icon: BookOpen,
    build: (arg) =>
      arg.trim()
        ? `Walk me through a ${arg.trim()} case.`
        : "Walk me through a hand surgery case.",
  },
  {
    trigger: "/quiz",
    label: "Start a quiz",
    description: "Begins quiz mode on a topic.",
    icon: MessageSquare,
    build: (arg) =>
      arg.trim()
        ? `Quiz me on ${arg.trim()}.`
        : "Quiz me on a high-yield hand surgery topic.",
  },
  {
    trigger: "/pearl",
    label: "Surface a pearl",
    description: "Asks the tutor for an attributable pearl on a topic.",
    icon: Sparkles,
    build: (arg) =>
      arg.trim()
        ? `Give me an attributable pearl on ${arg.trim()}.`
        : "Give me an attributable pearl from the Hand module.",
  },
  {
    trigger: "/mistake",
    label: "Common mistakes",
    description: "Surfaces the decision-time mistake card for a topic.",
    icon: TriangleAlert,
    build: (arg) =>
      arg.trim()
        ? `What's the common decision-time mistake in ${arg.trim()}?`
        : "What's a high-yield decision-time mistake in hand surgery?",
  },
  {
    trigger: "/donotmiss",
    label: "Do-not-miss red flag",
    description: "Surfaces a recognition-time red flag card.",
    icon: Eye,
    build: (arg) =>
      arg.trim()
        ? `Show me the do-not-miss red flag for ${arg.trim()}.`
        : "Walk me through a do-not-miss red flag in hand surgery.",
  },
]

interface SlashPaletteProps {
  /** Current input value. The palette opens when this starts with "/". */
  input: string
  /** Called when the user picks a command — pass the expanded prompt back. */
  onSelect: (expanded: string) => void
  /** Optional anchor element used for keyboard scrolling; not strictly needed. */
  className?: string
}

/**
 * A lightweight inline command palette. Appears above the chat input
 * whenever the input starts with "/". Arrow keys navigate; Enter selects.
 */
export function SlashPalette({ input, onSelect, className }: SlashPaletteProps) {
  const trimmed = input.trimStart()
  const isActive = trimmed.startsWith("/")
  const [query, argument] = useMemo(() => {
    if (!isActive) return ["", ""]
    const first = trimmed.split(/\s+/, 1)[0]
    const arg = trimmed.slice(first.length).trim()
    return [first, arg]
  }, [trimmed, isActive])

  const matches = useMemo(() => {
    if (!isActive) return []
    if (query.length <= 1) return SLASH_COMMANDS
    return SLASH_COMMANDS.filter((c) =>
      c.trigger.toLowerCase().startsWith(query.toLowerCase()),
    )
  }, [isActive, query])

  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || matches.length === 0) return
    function onKey(e: KeyboardEvent) {
      // Only steal arrow/enter when focus is on chat input
      const target = e.target as HTMLElement | null
      if (!target || target.getAttribute("aria-label") !== "Chat input") return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % matches.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + matches.length) % matches.length)
      } else if (e.key === "Enter" && !e.shiftKey) {
        // Only intercept if the user has not yet typed an argument *and* there is an exact match.
        // Otherwise, let the normal submit fire.
        if (matches[activeIndex]?.trigger === query && !argument) {
          e.preventDefault()
          onSelect(matches[activeIndex].build(argument))
        }
      } else if (e.key === "Tab") {
        e.preventDefault()
        const chosen = matches[activeIndex] ?? matches[0]
        if (chosen) onSelect(chosen.build(argument))
      }
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [isActive, matches, activeIndex, query, argument, onSelect])

  if (!isActive || matches.length === 0) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-floating",
        "animate-fade-up",
        className,
      )}
      role="listbox"
      aria-label="Slash commands"
    >
      <div className="border-b border-rule/60 bg-surface-subtle/60 px-4 py-2">
        <p className="text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Commands · Enter or Tab to pick
        </p>
      </div>
      <ul>
        {matches.map((cmd, i) => {
          const isActiveItem = i === activeIndex
          const Icon = cmd.icon
          return (
            <li key={cmd.trigger}>
              <button
                type="button"
                onClick={() => onSelect(cmd.build(argument))}
                onMouseEnter={() => setActiveIndex(i)}
                role="option"
                aria-selected={isActiveItem}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150",
                  isActiveItem ? "bg-electric-soft/50" : "hover:bg-surface-subtle",
                  "focus-visible:outline-none",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
                    isActiveItem ? "bg-electric text-bg" : "bg-surface-subtle text-ink-faint",
                  )}
                  aria-hidden="true"
                >
                  <Icon size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-small font-semibold text-ink">
                      {cmd.trigger}
                    </span>
                    <span className="text-small text-ink">{cmd.label}</span>
                  </span>
                  <span className="mt-0.5 block text-micro leading-snug text-ink-muted">
                    {cmd.description}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
