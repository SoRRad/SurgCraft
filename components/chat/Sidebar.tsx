"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  AlertTriangle,
  BookOpen,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  MessageSquare,
  MessageSquarePlus,
  Settings,
  Trash2,
} from "lucide-react"
import { SettingsDrawer } from "@/components/shell/SettingsDrawer"
import { getProviderStatusLabel, useProviderStatus } from "@/components/shell/useProviderStatus"
import { deleteConversation, listConversations, type Conversation } from "@/lib/demo/conversations"
import { cn } from "@/lib/utils"

function getRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return "Yesterday"
  return `${days}d ago`
}

const LIBRARY_LINKS = [
  { href: "/case", label: "Cases", icon: BookOpen },
  { href: "/mistakes", label: "Mistake Museum", icon: AlertTriangle },
  { href: "/donotmiss", label: "Do-Not-Miss", icon: Eye },
]

const SAVED_LINKS = [
  { href: "/pearls", label: "Saved pearls", icon: Bookmark },
]

interface SidebarInnerProps {
  onClose?: () => void
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 pb-2 pt-4 text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">
      {children}
    </p>
  )
}

export function SidebarInner({ onClose }: SidebarInnerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { status: providerStatus } = useProviderStatus()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showAll, setShowAll] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const refresh = useCallback(() => {
    setConversations(listConversations())
  }, [])

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
  const visibleConvs = showAll ? conversations : conversations.slice(0, 5)

  function handleNewConversation() {
    router.push("/c")
    onClose?.()
  }

  function handleConversationClick(id: string) {
    router.push(`/c/${id}`)
    onClose?.()
  }

  function handleDeleteConversation(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    if (!window.confirm("Delete this conversation?")) return
    deleteConversation(id)
    if (activeConvId === id) router.push("/c")
  }

  function handleLinkClick() {
    onClose?.()
  }

  return (
    <>
      <div className="flex h-full flex-col bg-bg">
        <div className="px-4 pb-3 pt-4">
          <button
            type="button"
            onClick={handleNewConversation}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3",
              "bg-electric text-small font-semibold text-bg shadow-soft",
              "transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:shadow-medium active:translate-y-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            )}
          >
            <MessageSquarePlus size={16} />
            New conversation
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
              {visibleConvs.map((conv) => {
                const isActive = conv.id === activeConvId
                return (
                  <li key={conv.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => handleConversationClick(conv.id)}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-left transition-all duration-300 ease-standard",
                        "hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                        isActive ? "bg-electric-soft text-ink shadow-[inset_0_0_0_1px_var(--electric-soft)]" : "text-ink"
                      )}
                    >
                      <span className="flex items-start gap-2">
                        <MessageSquare size={14} className={cn("mt-0.5 flex-shrink-0", isActive ? "text-electric" : "text-ink-faint")} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-small font-medium leading-snug">{conv.title}</span>
                          <span className="block text-micro text-ink-muted">{getRelativeTime(conv.updatedAt)}</span>
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                      className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-muted opacity-0",
                        "transition-all duration-200 ease-standard hover:bg-wrong-soft hover:text-wrong",
                        "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                        "group-hover:opacity-100 group-focus-within:opacity-100"
                      )}
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {conversations.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mx-2 mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-micro text-ink-muted transition-colors duration-200 ease-standard hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showAll ? "Show less" : `See all (${conversations.length})`}
            </button>
          )}

          <GroupLabel>Learning Library</GroupLabel>
          <ul className="space-y-1">
            {LIBRARY_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-small transition-all duration-300 ease-standard",
                      "hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                      isActive ? "bg-electric-soft font-medium text-ink" : "text-ink-muted hover:text-ink"
                    )}
                  >
                    <Icon size={15} className={isActive ? "text-electric" : "text-ink-faint"} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <GroupLabel>Saved</GroupLabel>
          <ul className="space-y-1">
            {SAVED_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-small transition-all duration-300 ease-standard",
                      "hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                      isActive ? "bg-electric-soft font-medium text-ink" : "text-ink-muted hover:text-ink"
                    )}
                  >
                    <Icon size={15} className={isActive ? "text-electric" : "text-ink-faint"} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="border-t border-rule/70 px-4 py-3">
          <div className="mb-3 rounded-xl bg-surface-subtle px-3 py-2">
            <p className="text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">Phase 0B.2</p>
            <p className="text-small text-ink-muted">{getProviderStatusLabel(providerStatus)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/about"
              onClick={handleLinkClick}
              className="flex items-center gap-1.5 rounded-lg px-1 py-1 text-micro text-ink-muted transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              <Info size={12} />
              About
            </Link>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-1 py-1 text-micro text-ink-muted transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              <Settings size={12} />
              Settings
            </button>
          </div>
        </div>
      </div>

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
