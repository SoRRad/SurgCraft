"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bookmark, BookOpen, MessageSquare } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { HandMascot } from "@/components/motif/HandMascot"
import { listPearls, removePearl, type SavedPearl } from "@/lib/demo/conversations"
import { cn } from "@/lib/utils"

function getRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

function PearlCard({ pearl, onRemove }: { pearl: SavedPearl; onRemove: () => void }) {
  const [confirm, setConfirm] = useState(false)

  function handleRemove() {
    if (!confirm) {
      setConfirm(true)
      return
    }
    removePearl(pearl.id)
    onRemove()
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-soft transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:shadow-medium">
      <div className="flex items-start justify-between gap-3 border-b border-rule/70 bg-surface-subtle/60 px-5 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <Bookmark size={14} className="flex-shrink-0 text-terracotta" />
          <Link
            href={`/c/${pearl.conversationId}`}
            className="truncate text-small text-ink-muted transition-colors duration-300 ease-standard hover:text-electric"
          >
            {pearl.conversationTitle}
          </Link>
        </div>
        <span className="flex-shrink-0 text-micro text-ink-muted">{getRelativeTime(pearl.savedAt)}</span>
      </div>

      <div className="px-5 py-4">
        <p className="whitespace-pre-wrap text-body leading-relaxed text-ink">{pearl.content}</p>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pb-4">
        <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-micro text-ink-muted">
          Local to this browser
        </span>
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            "rounded-md px-2 py-1 text-micro transition-colors duration-200 ease-standard",
            confirm
              ? "bg-wrong-soft text-wrong hover:bg-wrong hover:text-bg"
              : "text-ink-muted hover:bg-wrong-soft hover:text-wrong",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          )}
        >
          {confirm ? "Confirm remove" : "Remove"}
        </button>
      </div>
    </article>
  )
}

function PearlsContent() {
  const [pearls, setPearls] = useState<SavedPearl[]>([])

  useEffect(() => {
    const refreshPearls = () => setPearls(listPearls())
    refreshPearls()
    window.addEventListener("surgicraft:pearls:updated", refreshPearls)
    return () => window.removeEventListener("surgicraft:pearls:updated", refreshPearls)
  }, [])

  if (pearls.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <HandMascot pose="open" size={80} className="opacity-60" />
        <div>
          <h2 className="mb-2 font-fraunces text-h2 text-ink">No pearls saved yet</h2>
          <p className="max-w-sm text-body text-ink-muted">
            Saved pearls are local to this browser. Click the bookmark icon on any chat answer to save it here.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/c"
            className="inline-flex items-center gap-2 rounded-xl bg-electric px-4 py-2 text-small font-semibold text-bg shadow-soft transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:shadow-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            <MessageSquare size={14} />
            Start chatting
          </Link>
          <Link
            href="/case"
            className="inline-flex items-center gap-2 rounded-xl border border-rule/70 bg-bg-elevated px-4 py-2 text-small font-semibold text-ink-muted shadow-soft transition-all duration-300 ease-standard hover:border-electric/40 hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            <BookOpen size={14} />
            Browse cases
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Bookmark size={20} className="text-terracotta" />
            <h1 className="font-fraunces text-h1 text-ink">My Pearls</h1>
          </div>
          <p className="text-body text-ink-muted">
            {pearls.length} saved {pearls.length === 1 ? "pearl" : "pearls"} from your conversations.
          </p>
          <p className="mt-2 text-micro text-ink-muted">
            Saved pearls are local to this browser. Faculty verification workflow is planned for Phase 0C.
          </p>
        </div>
        <Link
          href="/c"
          className="inline-flex items-center gap-2 rounded-xl border border-rule/70 bg-bg-elevated px-4 py-2 text-small font-semibold text-ink-muted shadow-soft transition-all duration-300 ease-standard hover:border-electric/40 hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
        >
          <MessageSquare size={14} />
          Back to chat
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pearls.map((pearl) => (
          <PearlCard
            key={pearl.id}
            pearl={pearl}
            onRemove={() => setPearls(listPearls())}
          />
        ))}
      </div>
    </div>
  )
}

export default function PearlsPage() {
  return (
    <ChatLayout>
      <div className="flex flex-1 overflow-y-auto">
        <PearlsContent />
      </div>
    </ChatLayout>
  )
}
