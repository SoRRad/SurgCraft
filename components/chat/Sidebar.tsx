"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  MessageSquarePlus, BookOpen, AlertTriangle, Eye,
  Bookmark, ChevronDown, ChevronUp, Settings, Info,
  Trash2,
} from "lucide-react"
import { listConversations, deleteConversation, type Conversation } from "@/lib/demo/conversations"
import { SettingsDrawer } from "@/components/shell/SettingsDrawer"
import { getProviderStatusLabel, useProviderStatus } from "@/components/shell/useProviderStatus"
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
  { href: "/pearls", label: "My Pearls", icon: Bookmark },
]

interface SidebarInnerProps {
  onClose?: () => void
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

  function handleLibraryClick() {
    onClose?.()
  }

  return (
    <>
      <div className="flex flex-col h-full bg-bg">

        {/* New conversation */}
        <div className="p-3 border-b border-rule">
          <button
            type="button"
            onClick={handleNewConversation}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-2.5 rounded-lg",
              "bg-electric text-bg font-fraunces text-small font-medium",
              "hover:opacity-90 transition-opacity duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            )}
          >
            <MessageSquarePlus size={16} />
            New conversation
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-3">

          {/* Recent conversations */}
          {conversations.length > 0 && (
            <section className="mb-4">
              <p className="px-4 mb-1.5 font-fraunces text-micro text-ink-muted uppercase tracking-wider">
                Recent
              </p>
              <ul>
                {visibleConvs.map((conv) => {
                  const isActive = conv.id === activeConvId
                  return (
                    <li key={conv.id} className="group relative">
                      <button
                        type="button"
                        onClick={() => handleConversationClick(conv.id)}
                        className={cn(
                          "w-full text-left px-4 py-2 flex flex-col gap-0.5 transition-colors duration-100",
                          "hover:bg-terracotta-soft/40",
                          isActive && "border-l-2 border-electric bg-electric-soft/30 pl-[14px]"
                        )}
                      >
                        <span
                          className={cn(
                            "text-small truncate leading-snug",
                            isActive ? "text-ink font-medium" : "text-ink"
                          )}
                        >
                          {conv.title}
                        </span>
                        <span className="text-micro text-ink-muted">
                          {getRelativeTime(conv.updatedAt)}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteConversation(e, conv.id)}
                        className={cn(
                          "absolute right-2 top-1/2 -translate-y-1/2",
                          "p-1 rounded text-ink-muted opacity-0 group-hover:opacity-100",
                          "hover:text-wrong hover:bg-wrong-soft transition-all duration-100",
                          "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric"
                        )}
                        aria-label="Delete conversation"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  )
                })}
              </ul>

              {conversations.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className={cn(
                    "w-full px-4 py-1.5 flex items-center gap-1.5 text-micro text-ink-muted",
                    "hover:text-ink transition-colors duration-100",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric rounded"
                  )}
                >
                  {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showAll ? "Show less" : `See all (${conversations.length})`}
                </button>
              )}
            </section>
          )}

          {/* Library */}
          <section>
            <p className="px-4 mb-1.5 font-fraunces text-micro text-ink-muted uppercase tracking-wider">
              Library
            </p>
            <ul>
              {LIBRARY_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={handleLibraryClick}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2 text-small transition-colors duration-100",
                      "hover:bg-terracotta-soft/40",
                      pathname === href
                        ? "text-ink font-medium border-l-2 border-electric bg-electric-soft/30 pl-[14px]"
                        : "text-ink-muted hover:text-ink"
                    )}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-rule px-4 py-3 space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href="/about"
              onClick={handleLibraryClick}
              className="flex items-center gap-1.5 text-micro text-ink-muted hover:text-ink transition-colors duration-100"
            >
              <Info size={12} />
              About
            </Link>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 text-micro text-ink-muted hover:text-ink transition-colors duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric rounded"
            >
              <Settings size={12} />
              Settings
            </button>
          </div>
          <p className="text-micro text-ink-muted">
            Phase 0B · {getProviderStatusLabel(providerStatus)}
          </p>
        </div>

      </div>

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
