"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { useEffect, useMemo, useRef, useState } from "react"
import { CitationChip } from "./CitationChip"
import { cn } from "@/lib/utils"

const SUGGESTED_PROMPTS = [
  "Walk me through a fight bite case",
  "Quiz me on flexor tendon zones",
  "Common mistakes in mallet finger",
  "What is acute carpal tunnel syndrome?",
]

// ── Text extraction from UIMessage parts ─────────────────────────────────────

function getMessageText(message: UIMessage): string {
  return (message.parts ?? [])
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

// ── Citation + markdown renderer ──────────────────────────────────────────────

const CITATION_RE = /\[([^\]]+?),\s*(\d{4})\]/g

function MessageContent({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  CITATION_RE.lastIndex = 0

  while ((match = CITATION_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<InlineText key={lastIndex} text={text.slice(lastIndex, match.index)} />)
    }
    parts.push(<CitationChip key={match.index} source={match[1]} year={match[2]} />)
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(<InlineText key={lastIndex} text={text.slice(lastIndex)} />)
  }

  return <>{parts}</>
}

function InlineText({ text }: { text: string }) {
  const segments = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith("**") && seg.endsWith("**")) {
          return <strong key={i}>{seg.slice(2, -2)}</strong>
        }
        return seg.split("\n").map((line, j) => (
          <span key={`${i}-${j}`}>
            {j > 0 && <br />}
            {line}
          </span>
        ))
      })}
    </>
  )
}

// ── Suggested prompt chips ────────────────────────────────────────────────────

function PromptChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full border border-rule bg-bg-elevated text-small text-ink-muted",
        "hover:border-electric hover:text-electric transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2",
        "text-left"
      )}
    >
      {label}
    </button>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  handle: string
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onSuggestedPrompt: (prompt: string) => void
}

function EmptyState({
  handle,
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onSuggestedPrompt,
}: EmptyStateProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`
  }, [input])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-[720px] space-y-8">
        {/* Greeting */}
        <div className="text-center space-y-2">
          <p className="text-micro text-ink-muted uppercase tracking-widest font-inter">
            § SurgiCraft · Handcraft
          </p>
          <h1 className="font-fraunces text-h1 text-ink leading-tight">
            What are we working on today,{" "}
            <span className="text-terracotta">{handle}</span>?
          </h1>
          <p className="text-body text-ink-muted">
            Ask a question, work through a case, or quiz yourself.
          </p>
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div
            className={cn(
              "relative border rounded-lg bg-bg-elevated transition-shadow duration-150",
              "border-rule focus-within:border-electric focus-within:ring-2 focus-within:ring-electric/20"
            )}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask a hand surgery question…"
              rows={3}
              aria-label="Chat input"
              className={cn(
                "w-full resize-none bg-transparent px-4 pt-4 pb-12",
                "text-body text-ink placeholder:text-ink-muted",
                "focus:outline-none overflow-hidden"
              )}
            />
            <div className="absolute bottom-3 right-3">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "px-4 py-1.5 rounded-md text-small font-medium transition-colors duration-150",
                  "bg-electric text-bg",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                )}
              >
                {isLoading ? "···" : "Ask →"}
              </button>
            </div>
          </div>

          {/* Suggested prompts */}
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTED_PROMPTS.map((p) => (
              <PromptChip key={p} label={p} onClick={() => onSuggestedPrompt(p)} />
            ))}
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({
  role,
  content,
  isStreaming,
}: {
  role: "user" | "assistant"
  content: string
  isStreaming: boolean
}) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar dot */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5",
          isUser ? "bg-electric-soft text-electric" : "bg-terracotta-soft text-terracotta",
          "text-micro font-semibold"
        )}
      >
        {isUser ? "U" : "H"}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-3 text-body leading-relaxed",
          isUser
            ? "bg-electric-soft text-ink rounded-tr-none"
            : "bg-bg-elevated border border-rule text-ink rounded-tl-none"
        )}
      >
        <MessageContent text={content} />
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-terracotta ml-0.5 animate-pulse align-middle" />
        )}
      </div>
    </div>
  )
}

// ── Conversation input bar ────────────────────────────────────────────────────

interface ConversationInputProps {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

function ConversationInput({ input, isLoading, onInputChange, onSubmit }: ConversationInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  return (
    <div className="border-t border-rule bg-bg px-4 py-3 flex-shrink-0">
      <div className="mx-auto max-w-2xl">
        <form onSubmit={onSubmit} className="flex gap-2 items-end">
          <div
            className={cn(
              "flex-1 relative border rounded-lg bg-bg-elevated transition-shadow duration-150",
              "border-rule focus-within:border-electric focus-within:ring-2 focus-within:ring-electric/20"
            )}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Follow up…"
              rows={1}
              aria-label="Chat input"
              className={cn(
                "w-full resize-none bg-transparent px-3 py-2.5",
                "text-body text-ink placeholder:text-ink-muted",
                "focus:outline-none overflow-hidden"
              )}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className={cn(
              "px-4 py-2.5 rounded-lg text-small font-medium transition-colors duration-150 flex-shrink-0",
              "bg-electric text-bg",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            )}
          >
            {isLoading ? "···" : "→"}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main ChatExperience component ─────────────────────────────────────────────

interface ChatExperienceProps {
  conversationId?: string
}

export function ChatExperience({ conversationId }: ChatExperienceProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: conversationId ? { conversationId } : undefined,
      }),
    [conversationId]
  )

  const { messages, sendMessage, status } = useChat({ transport })

  const [input, setInput] = useState("")
  const [handle, setHandle] = useState("doctor")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    const raw =
      localStorage.getItem("surgicraft_demo_user") ??
      localStorage.getItem("handcraft_user")
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.handle) setHandle(parsed.handle)
      } catch {
        // ignore
      }
    }
  }, [])

  // Auto-scroll to bottom on new message content
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (nearBottom || isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  function handleScroll() {
    const el = scrollContainerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    setShowScrollButton(!atBottom)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput("")
    await sendMessage({ text })
  }

  async function handleSuggestedPrompt(prompt: string) {
    setInput("")
    await sendMessage({ text: prompt })
  }

  const hasMessages = messages.length > 0
  const lastAssistantIdx = messages.reduce(
    (acc, m, i) => (m.role === "assistant" ? i : acc),
    -1
  )

  if (!hasMessages) {
    return (
      <EmptyState
        handle={handle}
        input={input}
        isLoading={isLoading}
        onInputChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        onSuggestedPrompt={handleSuggestedPrompt}
      />
    )
  }

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden">
      {/* Scrollable messages area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto max-w-2xl px-4 py-6 space-y-6 pb-4">
          {messages.map((m, i) => (
            <MessageBubble
              key={m.id}
              role={m.role as "user" | "assistant"}
              content={getMessageText(m)}
              isStreaming={isLoading && i === lastAssistantIdx}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollButton && (
        <button
          type="button"
          onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
          className={cn(
            "absolute bottom-20 right-4 md:right-8 z-10",
            "w-8 h-8 rounded-full border border-rule bg-bg-elevated shadow-sm",
            "text-ink-muted hover:text-ink flex items-center justify-center",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          )}
          aria-label="Scroll to bottom"
        >
          ↓
        </button>
      )}

      {/* Fixed input bar */}
      <ConversationInput
        input={input}
        isLoading={isLoading}
        onInputChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
