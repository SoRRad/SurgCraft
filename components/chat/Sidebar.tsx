"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  AlertTriangle,
  BookOpen,
  Bookmark,
  ClipboardCheck,
  Compass,
  Eye,
  GraduationCap,
  Info,
  Keyboard,
  MessageSquare,
  MessageSquarePlus,
  Settings,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { SettingsDrawer } from "@/components/shell/SettingsDrawer"
import { getProviderStatusLabel, useProviderStatus } from "@/components/shell/useProviderStatus"
import { deleteConversation, listConversations, type Conversation } from "@/lib/demo/conversations"
import { cn } from "@/lib/utils"

const LEARN_LINKS = [
  { href: "/case", label: "Cases", icon: BookOpen },
  { href: "/topics", label: "Topics", icon: Compass },
  { href: "/mistakes", label: "Mistakes", icon: AlertTriangle },
  { href: "/donotmiss", label: "Do-Not-Miss", icon: Eye },
  { href: "/rapid", label: "Rapid Q&A", icon: GraduationCap },
  { href: "/preop", label: "Pre-Op Prep", icon: ClipboardCheck },
]

const SAVED_LINKS = [{ href: "/pearls", label: "Pearls", icon: Bookmark }]
const REVIEW_LINKS = [{ href: "/admin/review", label: "Content Review", icon: ShieldCheck }]

function getRelativeTime(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return "Yesterday"
  return `${days}d ago`
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-4 pb-2 pt-4 text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">{children}</p>
}

export function SidebarInner({ onClose }: { onClose?: () => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const { status: providerStatus } = useProviderStatus()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)

  const refresh = useCallback(() => setConversations(listConversations()), [])

  useEffect(() => {
    refresh()
    window.addEventListener("surgicraft:conversations:updated", refresh)
    window.addEventListener("focus", refresh)
    return () => {
      window.removeEventListener("surgicraft:conversations:updated", refresh)
      window.removeEventListener("focus", refresh)
    }
  }, [refresh])

  const activeConvId = pathname.startsWith("/c/") ? pathname.slice(3) : null

  return (
    <>
      <div className="flex h-full flex-col bg-bg">
        <div className="px-4 pb-3 pt-4">
          <button
            type="button"
            onClick={() => {
              router.push("/c")
              onClose?.()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-electric px-4 py-2.5 text-small font-semibold text-bg shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            <MessageSquarePlus size={16} />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          <GroupLabel>Recent</GroupLabel>
          {conversations.length === 0 ? (
            <div className="mx-2 rounded-xl bg-surface-subtle px-3 py-3 text-small text-ink-muted">
              Start a chat and it will appear here.
            </div>
          ) : (
            <ul className="space-y-1">
              {conversations.slice(0, 8).map((conv) => (
                <li key={conv.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/c/${conv.id}`)
                      onClose?.()
                    }}
                    className={cn(
                      "w-full rounded-xl px-3 py-2.5 text-left hover:bg-surface-subtle",
                      conv.id === activeConvId ? "bg-electric-soft" : ""
                    )}
                  >
                    <span className="flex items-start gap-2">
                      <MessageSquare size={14} className="mt-0.5" />
                      <span className="min-w-0">
                        <span className="block truncate text-small font-medium">{conv.title}</span>
                        <span className="block text-micro text-ink-muted">{getRelativeTime(conv.updatedAt)}</span>
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm("Delete this conversation?")) deleteConversation(conv.id)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-muted opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <GroupLabel>Learn</GroupLabel>
          <ul className="space-y-1">
            {LEARN_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => onClose?.()}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-small hover:bg-surface-subtle",
                    pathname === href ? "bg-electric-soft font-medium text-ink" : "text-ink-muted"
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <GroupLabel>Saved</GroupLabel>
          <ul className="space-y-1">
            {SAVED_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => onClose?.()}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-small hover:bg-surface-subtle",
                    pathname === href ? "bg-electric-soft font-medium text-ink" : "text-ink-muted"
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <GroupLabel>Review</GroupLabel>
          <ul className="space-y-1">
            {REVIEW_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => onClose?.()}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-small hover:bg-surface-subtle",
                    pathname === href ? "bg-electric-soft font-medium text-ink" : "text-ink-muted"
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-rule/70 px-4 py-3">
          <div className="mb-3 rounded-xl bg-surface-subtle px-3 py-2">
            <p className="text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">Phase 0B.2</p>
            <p className="text-small text-ink-muted">{getProviderStatusLabel(providerStatus)}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/about" onClick={() => onClose?.()} className="flex items-center gap-1.5 rounded-lg px-1 py-1 text-micro text-ink-muted hover:text-ink">
              <Info size={12} /> About
            </Link>
            <button type="button" onClick={() => setSettingsOpen(true)} className="flex items-center gap-1.5 rounded-lg px-1 py-1 text-micro text-ink-muted hover:text-ink">
              <Settings size={12} /> Settings
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }))}
              className="ml-auto flex items-center gap-1.5 rounded-lg px-1 py-1 text-micro text-ink-muted hover:text-ink"
            >
              <Keyboard size={12} />
              <span className="hidden font-mono lg:inline">?</span>
            </button>
          </div>
        </div>
      </div>

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
