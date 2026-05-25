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
  Compass,
  Info,
  Keyboard,
  Layers,
  type LucideIcon,
  MessageSquare,
  Plus,
  Settings,
  ShieldAlert,
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

/**
 * Sidebar nav is intentionally short. Labels are what a textbook would
 * call them (no invented internal terms like "Mistake Museum").
 */
const LEARN_LINKS = [
  { href: "/case",      label: "Cases",          icon: BookOpen },
  { href: "/mistakes",  label: "Common pitfalls", icon: AlertTriangle },
  { href: "/donotmiss", label: "Red flags",      icon: ShieldAlert },
  { href: "/topics",    label: "Topics",         icon: Compass },
]

const SAVED_LINKS = [
  { href: "/pearls", label: "Saved pearls", icon: Bookmark },
]

const PLATFORM_LINKS = [
  { href: "/modules", label: "Modules", icon: Layers },
]

interface SidebarInnerProps {
  onClose?: () => void
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
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
        {/* Brand strip */}
        <div className="flex items-center gap-2 px-4 pb-3 pt-4">
          <Link
            href="/c"
            onClick={handleLinkClick}
            className="flex items-baseline gap-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            aria-label="ORION home"
          >
            <span className="font-fraunces text-[18px] font-semibold uppercase tracking-[0.14em] text-ink">
              ORION
            </span>
            <span className="font-fraunces text-small text-ink-faint">· Hand</span>
          </Link>
        </div>

        {/* New conversation */}
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={handleNewConversation}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5",
              "bg-electric text-small font-medium text-bg shadow-soft",
              "transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-medium active:translate-y-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            )}
          >
            <Plus size={15} />
            New conversation
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          <GroupLabel>Recent</GroupLabel>
          {conversations.length === 0 ? (
            <p className="mx-2 rounded-lg px-3 py-2 text-small text-ink-faint">
              No conversations yet.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {visibleConvs.map((conv) => {
                const isActive = conv.id === activeConvId
                return (
                  <li key={conv.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => handleConversationClick(conv.id)}
                      className={cn(
                        "w-full rounded-lg px-3 py-2 text-left transition-colors duration-200 ease-standard",
                        "hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                        isActive ? "bg-electric-soft text-ink" : "text-ink"
                      )}
                    >
                      <span className="flex items-start gap-2">
                        <MessageSquare
                          size={13}
                          className={cn(
                            "mt-0.5 flex-shrink-0",
                            isActive ? "text-electric" : "text-ink-faint"
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-small font-medium leading-snug">
                            {conv.title}
                          </span>
                          <span className="block text-[11px] text-ink-faint">
                            {getRelativeTime(conv.updatedAt)}
                          </span>
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-faint opacity-0",
                        "transition-all duration-150 ease-standard hover:bg-wrong-soft hover:text-wrong",
                        "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                        "group-hover:opacity-100 group-focus-within:opacity-100"
                      )}
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={12} />
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
              className="mx-2 mt-1 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-ink-muted transition-colors duration-150 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              {showAll ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              {showAll ? "Show less" : `Show all (${conversations.length})`}
            </button>
          )}

          <GroupLabel>Learn</GroupLabel>
          <NavList items={LEARN_LINKS} pathname={pathname} onClick={handleLinkClick} />

          <GroupLabel>Saved</GroupLabel>
          <NavList items={SAVED_LINKS} pathname={pathname} onClick={handleLinkClick} />

          <GroupLabel>Platform</GroupLabel>
          <NavList items={PLATFORM_LINKS} pathname={pathname} onClick={handleLinkClick} />
        </div>

        {/* Footer */}
        <div className="border-t border-rule/70 px-3 py-3">
          <div className="mb-2 rounded-lg bg-surface-subtle px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Mode
            </p>
            <p className="text-small text-ink-muted">
              {getProviderStatusLabel(providerStatus)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-ink-muted">
            <Link
              href="/about"
              onClick={handleLinkClick}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              <Info size={11} />
              About
            </Link>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              <Settings size={11} />
              Settings
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }))
              }}
              className="ml-auto flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (press ?)"
            >
              <Keyboard size={11} />
            </button>
          </div>
        </div>
      </div>

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

function NavList({
  items,
  pathname,
  onClick,
}: {
  items: NavItem[]
  pathname: string
  onClick: () => void
}) {
  return (
    <ul className="space-y-0.5">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onClick}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-small transition-colors duration-200 ease-standard",
                "hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                isActive ? "bg-electric-soft font-medium text-ink" : "text-ink-muted hover:text-ink"
              )}
            >
              <Icon
                size={14}
                className={isActive ? "text-electric" : "text-ink-faint"}
              />
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
