"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bookmark } from "lucide-react"
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
    if (!confirm) { setConfirm(true); return }
    removePearl(pearl.id)
    onRemove()
  }

  return (
    <article className="border border-rule rounded-lg bg-bg-elevated overflow-hidden">
      <div className="px-5 py-4 border-b border-rule bg-bg flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Bookmark size={14} className="text-terracotta flex-shrink-0" />
          <Link
            href={`/c/${pearl.conversationId}`}
            className="text-small text-ink-muted hover:text-electric truncate transition-colors duration-150"
          >
            {pearl.conversationTitle}
          </Link>
        </div>
        <span className="text-micro text-ink-muted flex-shrink-0">{getRelativeTime(pearl.savedAt)}</span>
      </div>

      <div className="px-5 py-4">
        <p className="text-body text-ink leading-relaxed whitespace-pre-wrap">{pearl.content}</p>
      </div>

      <div className="px-5 pb-4 flex justify-end">
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            "text-micro px-2 py-1 rounded transition-colors duration-150",
            confirm
              ? "text-wrong bg-wrong-soft hover:bg-wrong"
              : "text-ink-muted hover:text-wrong",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric"
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
    setPearls(listPearls())
  }, [])

  if (pearls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center px-6 py-20">
        <HandMascot pose="open" size={80} className="opacity-60" />
        <div>
          <h2 className="font-fraunces text-h2 text-ink mb-2">No pearls saved yet</h2>
          <p className="text-body text-ink-muted max-w-sm">
            Click the bookmark icon on any answer in the chat to save it here.
          </p>
        </div>
        <Link
          href="/c"
          className="px-4 py-2 rounded-lg bg-electric text-bg text-small font-medium hover:opacity-90 transition-opacity duration-150"
        >
          Start chatting →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Bookmark size={20} className="text-terracotta" />
          <h1 className="font-fraunces text-h1 text-ink">My Pearls</h1>
        </div>
        <p className="text-body text-ink-muted">
          {pearls.length} saved {pearls.length === 1 ? "pearl" : "pearls"} from your conversations.
        </p>
      </div>

      <div className="space-y-4">
        {pearls.map((pearl) => (
          <PearlCard
            key={pearl.id}
            pearl={pearl}
            onRemove={() => setPearls(listPearls())}
          />
        ))}
      </div>

      <p className="mt-8 text-micro text-ink-muted text-center">
        Pearls are stored locally in your browser. Phase 0C will sync them to your profile.
      </p>
    </div>
  )
}

export default function PearlsPage() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <PearlsContent />
      </div>
    </ChatLayout>
  )
}
