"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import {
  ThumbsUp, ThumbsDown, Flag, Bookmark, Copy, Check, X,
} from "lucide-react"
import { CitationChip } from "./CitationChip"
import { CaseLauncher } from "./tool-results/CaseLauncher"
import { InlinePearlCard } from "./tool-results/InlinePearlCard"
import { InlineMistakeCard } from "./tool-results/InlineMistakeCard"
import { DoNotMissCard } from "./tool-results/DoNotMissCard"
import { QuizStarter } from "./tool-results/QuizStarter"
import { FollowupChips } from "./tool-results/FollowupChips"
import {
  createConversation, appendMessage, updateMessage, updateConversationTitle,
  getConversation, removePearlByMessageId, savePearl, type ChatMessage,
} from "@/lib/demo/conversations"
import { getDemoUser, migrateFromWeek1Key } from "@/lib/demo/demo-user"
import { cn } from "@/lib/utils"

// ── Suggested prompts ─────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "Walk me through a fight bite case",
  "Quiz me on flexor tendon zones",
  "Common mistakes in mallet finger",
  "What is acute carpal tunnel syndrome?",
]

// ── UIMessage helpers ─────────────────────────────────────────────────────────

function toUIMessage(msg: ChatMessage): UIMessage {
  return {
    id: msg.id,
    role: msg.role as UIMessage["role"],
    parts: msg.parts?.length ? msg.parts : msg.content ? [{ type: "text" as const, text: msg.content }] : [],
  } as UIMessage
}

function getMessageText(message: UIMessage): string {
  return (message.parts ?? [])
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

function getRecordText(value: unknown, key: string): string {
  if (typeof value !== "object" || value === null || !(key in value)) return ""
  const field = (value as Record<string, unknown>)[key]
  return typeof field === "string" ? field : ""
}

function getToolPartSummary(part: UIMessage["parts"][number]): string | null {
  if (!part.type.startsWith("tool-")) return null

  const toolName = part.type.slice(5)
  const toolPart = part as unknown as { state?: string; output?: unknown }
  if (toolPart.state !== "output-available") return null

  const output = toolPart.output
  switch (toolName) {
    case "launch_case": {
      const title = getRecordText(output, "title")
      const id = getRecordText(output, "id")
      return title ? `Tool result: launched case "${title}"${id ? ` (${id})` : ""}.` : null
    }
    case "show_pearl": {
      const topic = getRecordText(output, "topic")
      const content = getRecordText(output, "text") || getRecordText(output, "content")
      return content ? `Tool result: pearl${topic ? ` on ${topic}` : ""}: ${content}` : null
    }
    case "show_mistake": {
      const title = getRecordText(output, "title")
      const mistake = getRecordText(output, "mistake")
      return title || mistake ? `Tool result: common mistake${title ? `, ${title}` : ""}${mistake ? `: ${mistake}` : "."}` : null
    }
    case "show_donotmiss": {
      const diagnosis = getRecordText(output, "diagnosis")
      const clue = getRecordText(output, "clue")
      return diagnosis || clue ? `Tool result: do-not-miss${diagnosis ? `, ${diagnosis}` : ""}${clue ? `: ${clue}` : "."}` : null
    }
    case "start_quiz": {
      const topic = getRecordText(output, "topic")
      const intensity = getRecordText(output, "intensity")
      return topic ? `Tool result: quiz ready on ${topic}${intensity ? ` (${intensity})` : ""}.` : null
    }
    case "suggest_followups": {
      if (typeof output !== "object" || output === null) return null
      const chips = (output as Record<string, unknown>).chips
      return Array.isArray(chips) && chips.length > 0
        ? `Tool result: suggested follow-ups: ${chips.filter((chip): chip is string => typeof chip === "string").join("; ")}`
        : null
    }
    default:
      return null
  }
}

function getMessageContentForStorage(message: UIMessage): string {
  const text = getMessageText(message).trim()
  const toolSummaries = (message.parts ?? [])
    .map(getToolPartSummary)
    .filter((summary): summary is string => Boolean(summary))

  return [text, ...toolSummaries].filter(Boolean).join("\n\n")
}

function getMessageSnapshot(message: UIMessage): string {
  return JSON.stringify({
    id: message.id,
    role: message.role,
    parts: message.parts ?? [],
  })
}

// ── Markdown + citation renderer ──────────────────────────────────────────────

function MarkdownMessage({ text }: { text: string }) {
  // Convert [Source, Year] to markdown link syntax so react-markdown's <a> component can catch them
  const processed = text.replace(
    /\[([^\]]+?),\s*(\d{4})\]/g,
    (_, source, year) => `[${source}, ${year}](citation:${encodeURIComponent(source)}|${year})`
  )

  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => {
          if (href?.startsWith("citation:")) {
            const payload = href.slice("citation:".length)
            const [encodedSource, year] = payload.split("|")
            const source = decodeURIComponent(encodedSource ?? "")
            return <CitationChip source={source} year={year ?? ""} />
          }
          return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
        },
        // Map prose elements to design-system classes
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-body text-ink">{children}</li>,
        h1: ({ children }) => <h1 className="font-fraunces text-h2 text-ink mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="font-fraunces text-h3 text-ink mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="font-fraunces text-small font-semibold text-ink mb-1">{children}</h3>,
        code: ({ children }) => <code className="font-mono text-small bg-bg px-1 py-0.5 rounded text-ink-muted">{children}</code>,
        blockquote: ({ children }) => <blockquote className="border-l-2 border-terracotta pl-3 italic text-ink-muted">{children}</blockquote>,
      }}
    >
      {processed}
    </ReactMarkdown>
  )
}

// ── Tool part rendering ───────────────────────────────────────────────────────

interface ToolPartRenderProps {
  toolName: string
  state: string
  input: unknown
  output: unknown
  onSendMessage: (text: string) => Promise<void>
  onQuizBegin: (topic: string, intensity: string) => void
  conversationId: string | undefined
  conversationTitle: string
  onCaseComplete: (caseId: string, caseTitle: string) => void
}

function ToolPartRender({
  toolName, state, output, onSendMessage, onQuizBegin,
  conversationId, conversationTitle, onCaseComplete,
}: ToolPartRenderProps) {
  if (state !== "output-available") {
    return <p className="text-micro text-ink-muted italic">Loading {toolName}…</p>
  }

  switch (toolName) {
    case "launch_case": {
      const data = output as { id: string; title: string; stem: string; difficulty: string; estimatedMinutes: number; tags: string[]; reason: string } | null
      return (
        <CaseLauncher
          caseData={data}
          onCaseComplete={onCaseComplete}
        />
      )
    }
    case "show_pearl": {
      const data = output as Parameters<typeof InlinePearlCard>[0]["entry"]
      return <InlinePearlCard entry={data} />
    }
    case "show_mistake": {
      return <InlineMistakeCard entry={output as Parameters<typeof InlineMistakeCard>[0]["entry"]} />
    }
    case "show_donotmiss": {
      return <DoNotMissCard entry={output as Parameters<typeof DoNotMissCard>[0]["entry"]} />
    }
    case "start_quiz": {
      const data = output as { topic: string; intensity: "gentle" | "standard" | "pyrotechnic" } | null
      if (!data) return null
      return <QuizStarter {...data} onBegin={onQuizBegin} />
    }
    case "suggest_followups": {
      const data = output as { chips: string[] } | null
      if (!data) return null
      return <FollowupChips chips={data.chips} onChipClick={(chip) => onSendMessage(chip)} />
    }
    default:
      return null
  }
}

// ── Message action row ────────────────────────────────────────────────────────

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
  activeColor?: string
}

function ActionButton({ icon, label, active, onClick, activeColor = "text-electric" }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "p-1 rounded transition-colors duration-100",
        "hover:bg-bg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric",
        active ? activeColor : "text-ink-muted hover:text-ink"
      )}
    >
      {icon}
    </button>
  )
}

interface MessageActionsProps {
  messageId: string
  conversationId: string | undefined
  content: string
  conversationTitle: string
  role: "user" | "assistant"
  feedback: "up" | "down" | null | undefined
  flagged: boolean | undefined
  savedAsPearl: boolean | undefined
  onUpdate: (patch: Partial<ChatMessage>) => void
}

function MessageActions({
  messageId, conversationId, content, conversationTitle,
  role, feedback, flagged, savedAsPearl, onUpdate,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleFeedback(val: "up" | "down") {
    if (!conversationId) return
    const next = feedback === val ? null : val
    updateMessage(conversationId, messageId, { feedback: next })
    onUpdate({ feedback: next })
  }

  function handleFlag() {
    if (!conversationId) return
    const next = !flagged
    updateMessage(conversationId, messageId, { flagged: next })
    onUpdate({ flagged: next })
  }

  function handleSavePearl() {
    if (!conversationId) return
    const next = !savedAsPearl
    if (next) {
      savePearl({ content, conversationId, conversationTitle, messageId })
    } else {
      removePearlByMessageId(messageId)
    }
    updateMessage(conversationId, messageId, { savedAsPearl: next })
    onUpdate({ savedAsPearl: next })
  }

  if (role === "user") {
    return (
      <div className="flex gap-1 mt-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        <ActionButton icon={copied ? <Check size={13} /> : <Copy size={13} />} label="Copy" onClick={handleCopy} />
      </div>
    )
  }

  return (
    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
      <ActionButton
        icon={<ThumbsUp size={13} className={feedback === "up" ? "fill-current" : ""} />}
        label="Good response"
        active={feedback === "up"}
        onClick={() => handleFeedback("up")}
      />
      <ActionButton
        icon={<ThumbsDown size={13} className={feedback === "down" ? "fill-current" : ""} />}
        label="Bad response"
        active={feedback === "down"}
        onClick={() => handleFeedback("down")}
      />
      <ActionButton
        icon={<Flag size={13} className={flagged ? "fill-current" : ""} />}
        label="Flag for faculty"
        active={flagged}
        activeColor="text-terracotta"
        onClick={handleFlag}
      />
      <ActionButton
        icon={<Bookmark size={13} className={savedAsPearl ? "fill-current" : ""} />}
        label="Save to pearls"
        active={savedAsPearl}
        onClick={handleSavePearl}
      />
      <ActionButton
        icon={copied ? <Check size={13} /> : <Copy size={13} />}
        label="Copy"
        onClick={handleCopy}
      />
    </div>
  )
}

// ── Message bubble ────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: UIMessage
  isStreaming: boolean
  conversationId: string | undefined
  conversationTitle: string
  localMeta?: Partial<ChatMessage>
  onMetaUpdate: (patch: Partial<ChatMessage>) => void
  onSendMessage: (text: string) => Promise<void>
  onQuizBegin: (topic: string, intensity: string) => void
  onCaseComplete: (caseId: string, caseTitle: string) => void
}

function MessageBubble({
  message, isStreaming, conversationId, conversationTitle,
  localMeta, onMetaUpdate, onSendMessage, onQuizBegin, onCaseComplete,
}: MessageBubbleProps) {
  const isUser = message.role === "user"
  const textContent = getMessageText(message)
  const parts = message.parts ?? []

  // Separate text and tool parts for rendering
  const hasToolParts = parts.some((p) => p.type.startsWith("tool-"))

  return (
    <div className={cn("group flex flex-col gap-0.5", isUser && "items-end")}>
      <div className={cn("flex gap-3 w-full", isUser && "flex-row-reverse")}>
        {/* Avatar */}
        <div className={cn(
          "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5",
          isUser ? "bg-electric-soft text-electric" : "bg-terracotta-soft text-terracotta",
          "text-micro font-semibold flex-shrink-0"
        )}>
          {isUser ? "U" : "H"}
        </div>

        {/* Content column */}
        <div className={cn("flex flex-col gap-2 min-w-0", isUser ? "items-end max-w-[85%]" : "flex-1")}>
          {/* Text bubble */}
          {textContent && (
            <div className={cn(
              "rounded-lg px-4 py-3 text-body leading-relaxed",
              isUser
                ? "bg-electric-soft text-ink rounded-tr-none"
                : "bg-bg-elevated border border-rule text-ink rounded-tl-none"
            )}>
              <MarkdownMessage text={textContent} />
              {isStreaming && !hasToolParts && (
                <span className="inline-block w-1.5 h-4 bg-terracotta ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          )}

          {/* Tool results — rendered outside the bubble for full width */}
          {!isUser && parts.map((part, i) => {
            if (!part.type.startsWith("tool-")) return null
            const toolName = part.type.slice(5) // remove 'tool-' prefix
            const anyPart = part as unknown as { state: string; input: unknown; output: unknown }
            return (
              <div key={i} className="w-full">
                <ToolPartRender
                  toolName={toolName}
                  state={anyPart.state}
                  input={anyPart.input}
                  output={anyPart.output}
                  onSendMessage={onSendMessage}
                  onQuizBegin={onQuizBegin}
                  conversationId={conversationId}
                  conversationTitle={conversationTitle}
                  onCaseComplete={onCaseComplete}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Action row */}
      {textContent && (
        <div className={cn("px-10", isUser ? "flex justify-end" : "")}>
          <MessageActions
            messageId={message.id}
            conversationId={conversationId}
            content={textContent}
            conversationTitle={conversationTitle}
            role={message.role as "user" | "assistant"}
            feedback={localMeta?.feedback}
            flagged={localMeta?.flagged}
            savedAsPearl={localMeta?.savedAsPearl}
            onUpdate={onMetaUpdate}
          />
        </div>
      )}
    </div>
  )
}

// ── Quiz banner ───────────────────────────────────────────────────────────────

interface QuizBannerProps {
  topic: string
  questionsAsked: number
  onEnd: () => void
}

function QuizBanner({ topic, questionsAsked, onEnd }: QuizBannerProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-electric-soft/30 border-b border-electric-soft flex-shrink-0">
      <span className="text-small font-medium text-electric flex-1 truncate">
        Quiz: {topic} · {questionsAsked}/5
      </span>
      <button
        type="button"
        onClick={onEnd}
        className="flex items-center gap-1 text-micro text-ink-muted hover:text-ink flex-shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric rounded"
      >
        <X size={12} />
        End quiz
      </button>
    </div>
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

function EmptyState({ handle, input, isLoading, onInputChange, onSubmit, onSuggestedPrompt }: EmptyStateProps) {
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
      if (input.trim() && !isLoading) onSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-[720px] space-y-8">
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
          <p className="text-small text-ink-muted">
            No PHI: do not enter names, MRNs, dates of birth, or other patient identifiers.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className={cn(
            "relative border rounded-lg bg-bg-elevated transition-shadow duration-150",
            "border-rule focus-within:border-electric focus-within:ring-2 focus-within:ring-electric/20"
          )}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask a hand surgery question…"
              rows={3}
              aria-label="Chat input"
              className="w-full resize-none bg-transparent px-4 pt-4 pb-12 text-body text-ink placeholder:text-ink-muted focus:outline-none overflow-hidden"
            />
            <div className="absolute bottom-3 right-3">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "px-4 py-1.5 rounded-md text-small font-medium transition-colors duration-150",
                  "bg-electric text-bg disabled:opacity-40 disabled:cursor-not-allowed",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                )}
              >
                {isLoading ? "···" : "Ask →"}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onSuggestedPrompt(p)}
                className={cn(
                  "px-4 py-2 rounded-full border border-rule bg-bg-elevated text-small text-ink-muted",
                  "hover:border-electric hover:text-electric transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </form>
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
      if (input.trim() && !isLoading) onSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="border-t border-rule bg-bg px-4 py-3 flex-shrink-0">
      <div className="mx-auto max-w-2xl">
        <form onSubmit={onSubmit} className="flex gap-2 items-end">
          <div className={cn(
            "flex-1 relative border rounded-lg bg-bg-elevated transition-shadow duration-150",
            "border-rule focus-within:border-electric focus-within:ring-2 focus-within:ring-electric/20"
          )}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Follow up…"
              rows={1}
              aria-label="Chat input"
              className="w-full resize-none bg-transparent px-3 py-2.5 text-body text-ink placeholder:text-ink-muted focus:outline-none overflow-hidden"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className={cn(
              "px-4 py-2.5 rounded-lg text-small font-medium transition-colors duration-150 flex-shrink-0",
              "bg-electric text-bg disabled:opacity-40 disabled:cursor-not-allowed",
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

// ── Privacy banner ────────────────────────────────────────────────────────────

function PrivacyBanner() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const ack = localStorage.getItem("surgicraft:privacy-acknowledged")
    if (!ack) setShow(true)
  }, [])
  if (!show) return null
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-bg border-b border-rule text-small text-ink-muted flex-shrink-0">
      <span className="flex-1">
        Educational use only. Not for clinical decision-making. No PHI. Conversations are stored locally and never shared with faculty.
      </span>
      <button
        type="button"
        onClick={() => { localStorage.setItem("surgicraft:privacy-acknowledged", "1"); setShow(false) }}
        className="text-electric hover:underline flex-shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric rounded"
      >
        Got it
      </button>
    </div>
  )
}

// ── Main ChatExperience ───────────────────────────────────────────────────────

interface ChatExperienceProps {
  conversationId?: string
}

type LocalMeta = Partial<ChatMessage>

interface QuizState {
  topic: string
  intensity: string
  questionsAsked: number
}

export function ChatExperience({ conversationId }: ChatExperienceProps) {
  const router = useRouter()

  const [quizState, setQuizState] = useState<QuizState | null>(null)
  const [convId, setConvId] = useState<string | undefined>(conversationId)
  const [convTitle, setConvTitle] = useState("")

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          ...(convId ? { conversationId: convId } : {}),
          ...(quizState ? { quizMode: quizState } : {}),
        },
      }),
    // Rebuild transport when session context changes so retries/regenerations keep it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [convId, quizState?.topic, quizState?.intensity, quizState?.questionsAsked]
  )

  const { messages, sendMessage, status, setMessages } = useChat({ transport })

  const [input, setInput] = useState("")
  const [handle, setHandle] = useState("doctor")
  const [msgMeta, setMsgMeta] = useState<Record<string, LocalMeta>>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const prevStatusRef = useRef(status)
  const lastAssistantMsgIdRef = useRef<string | null>(null)
  const lastAssistantSnapshotRef = useRef<string | null>(null)

  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    migrateFromWeek1Key()
    setHandle(getDemoUser()?.handle ?? "doctor")
  }, [])

  useEffect(() => {
    setConvId(conversationId)
    if (!conversationId) return
    const conv = getConversation(conversationId)
    if (!conv) return
    setConvTitle(conv.title)
    const meta: Record<string, LocalMeta> = {}
    for (const m of conv.messages) {
      meta[m.id] = { feedback: m.feedback, flagged: m.flagged, savedAsPearl: m.savedAsPearl }
    }
    setMsgMeta(meta)
    if (conv.messages.length > 0) {
      const restoredMessages = conv.messages.map(toUIMessage)
      setMessages(restoredMessages)
      const lastAssistant = [...restoredMessages].reverse().find((m) => m.role === "assistant")
      lastAssistantMsgIdRef.current = lastAssistant?.id ?? null
      lastAssistantSnapshotRef.current = lastAssistant ? getMessageSnapshot(lastAssistant) : null
    }
  }, [conversationId, setMessages])

  // Pre-fill from URL query params (?prefill= or legacy ?q=)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get("prefill") ?? params.get("q")
    if (q && !conversationId) setInput(q)
  }, [conversationId])

  // Auto-scroll
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (nearBottom || isLoading) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Persist assistant message to localStorage when streaming settles.
  useEffect(() => {
    if (status === "ready" && convId) {
      const lastMsg = [...messages].reverse().find((m) => m.role === "assistant")
      if (lastMsg) {
        const snapshot = getMessageSnapshot(lastMsg)
        if (snapshot !== lastAssistantSnapshotRef.current) {
          lastAssistantSnapshotRef.current = snapshot
          const content = getMessageContentForStorage(lastMsg)
          appendMessage(convId, {
            id: lastMsg.id,
            role: "assistant",
            content: content || "Assistant response",
            parts: lastMsg.parts,
          })
        }

        if (lastMsg.id !== lastAssistantMsgIdRef.current) {
          lastAssistantMsgIdRef.current = lastMsg.id
          // Increment quiz questions asked once per completed assistant turn.
          if (prevStatusRef.current === "streaming" && quizState) {
            setQuizState((prev) => prev ? { ...prev, questionsAsked: prev.questionsAsked + 1 } : null)
          }
        }
      }
    }
    prevStatusRef.current = status
  }, [status, messages, convId, quizState])

  function handleScroll() {
    const el = scrollContainerRef.current
    if (!el) return
    setShowScrollButton(el.scrollHeight - el.scrollTop - el.clientHeight > 80)
  }

  const updateMeta = useCallback((id: string) => (patch: Partial<ChatMessage>) => {
    setMsgMeta((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }, [])

  async function doSend(text: string, requestQuizState: QuizState | null = quizState) {
    let currentConvId = convId

    if (!currentConvId) {
      const conv = createConversation(text)
      currentConvId = conv.id
      setConvId(conv.id)
      setConvTitle(conv.title)

      fetch("/api/chat/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstUserMessage: text }),
      })
        .then((r) => r.json())
        .then(({ title }: { title: string }) => {
          if (title) { updateConversationTitle(conv.id, title); setConvTitle(title) }
        })
        .catch(() => {})
    }

    const savedUserMsg = appendMessage(currentConvId, {
      role: "user",
      content: text,
      parts: [{ type: "text" as const, text }],
    })
    setMsgMeta((prev) => ({ ...prev, [savedUserMsg.id]: {} }))

    await sendMessage(
      { text, messageId: savedUserMsg.id },
      {
        body: {
          conversationId: currentConvId,
          ...(requestQuizState ? { quizMode: requestQuizState } : {}),
        },
      }
    )

    if (!conversationId) router.replace(`/c/${currentConvId}`)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput("")
    await doSend(text)
  }

  async function handleSendMessage(text: string) {
    setInput("")
    await doSend(text)
  }

  function handleQuizBegin(topic: string, intensity: string) {
    const nextQuizState = { topic, intensity, questionsAsked: 0 }
    setQuizState(nextQuizState)
    doSend(`Begin the quiz on "${topic}" at ${intensity} intensity.`, nextQuizState)
  }

  function handleQuizEnd() {
    setQuizState(null)
    doSend("End the quiz now and give me a summary of how I did.", null)
  }

  function handleCaseComplete(caseId: string, caseTitle: string) {
    doSend(`I just completed the "${caseTitle}" case (${caseId}). What's the key teaching point I should take away?`)
  }

  const hasMessages = messages.length > 0
  const lastAssistantIdx = messages.reduce((acc, m, i) => (m.role === "assistant" ? i : acc), -1)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PrivacyBanner />
      {quizState && (
        <QuizBanner
          topic={quizState.topic}
          questionsAsked={quizState.questionsAsked}
          onEnd={handleQuizEnd}
        />
      )}

      {!hasMessages ? (
        <EmptyState
          handle={handle}
          input={input}
          isLoading={isLoading}
          onInputChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          onSuggestedPrompt={(p) => { setInput(""); doSend(p) }}
        />
      ) : (
        <div className="relative flex flex-col flex-1 overflow-hidden">
          <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl px-4 py-6 space-y-6 pb-4">
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isStreaming={isLoading && i === lastAssistantIdx}
                  conversationId={convId}
                  conversationTitle={convTitle}
                  localMeta={msgMeta[m.id]}
                  onMetaUpdate={updateMeta(m.id)}
                  onSendMessage={handleSendMessage}
                  onQuizBegin={handleQuizBegin}
                  onCaseComplete={handleCaseComplete}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

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

          <ConversationInput
            input={input}
            isLoading={isLoading}
            onInputChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  )
}
