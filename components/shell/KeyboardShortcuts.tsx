"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Keyboard, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShortcutDef {
  keys: string[]
  label: string
  scope: "global" | "chat"
}

const SHORTCUTS: ShortcutDef[] = [
  { keys: ["?"], label: "Open this shortcuts panel", scope: "global" },
  { keys: ["n"], label: "Start a new conversation", scope: "chat" },
  { keys: ["/"], label: "Focus the chat input", scope: "chat" },
  { keys: ["g", "c"], label: "Go to chat", scope: "global" },
  { keys: ["g", "m"], label: "Go to Modules", scope: "global" },
  { keys: ["g", "l"], label: "Go to Library", scope: "global" },
  { keys: ["g", "r"], label: "Go to Resources", scope: "global" },
  { keys: ["g", "p"], label: "Go to Saved pearls", scope: "global" },
  { keys: ["g", "a"], label: "Go to About", scope: "global" },
  { keys: ["Esc"], label: "Close panels and dialogs", scope: "global" },
]

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
  if (target.isContentEditable) return true
  return false
}

/**
 * Global keyboard shortcuts + the help panel. Mount once near the root of the
 * chat shell. Avoids hijacking keys while the user is typing in inputs.
 */
export function KeyboardShortcuts() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const sequenceRef = useRef<{ key: string; ts: number } | null>(null)
  const SEQUENCE_TIMEOUT_MS = 800

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // Help: ? closes/opens the panel regardless of focus (but still ignore typing)
      if (e.key === "?" && !isTypingTarget(e.target)) {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }

      // Escape closes the help panel
      if (e.key === "Escape" && open) {
        setOpen(false)
        return
      }

      if (isTypingTarget(e.target)) return

      // /: focus chat input if present
      if (e.key === "/") {
        const ta = document.querySelector<HTMLTextAreaElement>('textarea[aria-label="Chat input"]')
        if (ta) {
          e.preventDefault()
          ta.focus()
        }
        return
      }

      // n: new conversation
      if (e.key === "n") {
        router.push("/c")
        return
      }

      // g + letter: two-key navigation
      const now = Date.now()
      if (e.key === "g") {
        sequenceRef.current = { key: "g", ts: now }
        return
      }
      const last = sequenceRef.current
      if (last?.key === "g" && now - last.ts < SEQUENCE_TIMEOUT_MS) {
        const route = (
          {
            c: "/c",
            m: "/modules",
            l: "/library",
            r: "/resources",
            p: "/pearls",
            a: "/about",
          } as Record<string, string>
        )[e.key]
        if (route) {
          e.preventDefault()
          router.push(route)
        }
        sequenceRef.current = null
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, router])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kbd-shortcuts-title"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-floating"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-rule/70 bg-surface-subtle/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <Keyboard size={14} className="text-ink-faint" />
            <p id="kbd-shortcuts-title" className="font-fraunces text-small font-semibold text-ink">
              Keyboard shortcuts
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          <ul className="space-y-1.5">
            {SHORTCUTS.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-subtle/60">
                <span className="text-small text-ink">{s.label}</span>
                <span className="flex gap-1">
                  {s.keys.map((k, i) => (
                    <span key={i} className={cn("flex h-6 min-w-[26px] items-center justify-center rounded-md border border-rule bg-bg px-1.5 font-mono text-micro text-ink", "shadow-[0_1px_0_var(--rule)]")}>
                      {k}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-micro text-ink-faint">
            Press <span className="font-mono">?</span> any time to open this panel. Shortcuts are disabled while typing in inputs.
          </p>
        </div>
      </div>
    </div>
  )
}
