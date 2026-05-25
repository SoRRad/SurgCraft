"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import {
  AlertTriangle, ArrowDown, Bookmark, BookOpen, Check, ClipboardList, Copy,
  Eye, Flag, Sparkles, ThumbsDown, ThumbsUp, X,
} from "lucide-react"
import { CitationChip } from "./CitationChip"
import { CaseLauncher } from "./tool-results/CaseLauncher"
import { InlinePearlCard } from "./tool-results/InlinePearlCard"
import { InlineMistakeCard } from "./tool-results/InlineMistakeCard"
import { DoNotMissCard } from "./tool-results/DoNotMissCard"
import { QuizStarter } from "./tool-results/QuizStarter"
import { FollowupChips } from "./tool-results/FollowupChips"
import { TodaysPearl } from "./TodaysPearl"
import { SlashPalette } from "./SlashPalette"
import {
  createConversation, appendMessage, updateMessage, updateConversationTitle,
  getConversation, removePearlByMessageId, savePearl, uiMessageToChatMessageInput, type ChatMessage,
} from "@/lib/demo/conversations"
import { getDemoUser, migrateFromWeek1Key } from "@/lib/demo/demo-user"
import { cn } from "@/lib/utils"

// -- Suggested prompts ---------------------------------------------------------

const SUGGESTED_PROMPTS = [
  "Manage a fight bite",
  "Walk me through a case",
  "Quiz me on flexor tendon zones",
  "Show common mistakes",
  "Do-not-miss diagnoses",
  "Prepare me for rounds",
]

const QUICK_STARTS = [
  {
    label: "Manage a fight bite",
    prompt: "How do I manage a fight bite?",
    helper: "High-yield infection framing",
    icon: Sparkles,
  },
  {
    label: "Walk me through a case",
    prompt: "Walk me through a fight bite case.",
    helper: "Progressive reveal",
    icon: BookOpen,
  },
  {
    label: "Quiz me",
    prompt: "Quiz me on flexor tendon zones.",
    helper: "One question at a time",
    icon: ClipboardList,
  },
  {
    label: "Common mistakes",
    prompt: "Common mistakes in mallet finger.",
    helper: "Error patterns",
    icon: AlertTriangle,
  },
  {
    label: "Do-not-miss",
    prompt: "Walk me through do-not-miss diagnoses in hand surgery.",
    helper: "Recognition clues",
    icon: Eye,
  },
  {
    label: "Prepare for rounds",
    prompt: "Prepare me for hand surgery rounds on fight bites.",
    helper: "One-liners and follow-ups",
    icon: Sparkles,
  },
]

// -- UIMessage helpers ---------------------------------------------------------

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

function getMessageSnapshot(message: UIMessage): string {
  return JSON.stringify({
    id: message.id,
    role: message.role,
    parts: message.parts ?? [],
  })
}

// -- Markdown + citation renderer ----------------------------------------------

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

// -- Tool part rendering -------------------------------------------------------

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
    return <p className="text-micro text-ink-muted italic">Loading {toolName}...</p>
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

// -- Message action row --------------------------------------------------------

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
        "rounded-md p-1.5 transition-all duration-200 ease-standard",
        "hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
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
      <div className="mt-1 flex justify-end gap-1 opacity-0 transition-opacity duration-200 ease-standard group-hover:opacity-100 group-focus-within:opacity-100">
        <ActionButton icon={copied ? <Check size={13} /> : <Copy size={13} />} label="Copy" onClick={handleCopy} />
      </div>
    )
  }

  return (
    <div className="mt-2 flex gap-1 opacity-0 transition-opacity duration-200 ease-standard group-hover:opacity-100 group-focus-within:opacity-100">
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
        label="Flag locally for review"
        active={flagged}
        activeColor="text-terracotta"
        onClick={handleFlag}
      />
      <ActionButton
        icon={<Bookmark size={13} className={savedAsPearl ? "fill-current" : ""} />}
        label={savedAsPearl ? "Remove from saved pearls" : "Save to pearls"}
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

// -- Message bubble ------------------------------------------------------------

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
      <div className={cn("flex w-full gap-3", isUser && "flex-row-reverse")}>
        {/* Avatar */}
        <div className={cn(
          "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(32,32,30,0.05)]",
          isUser ? "bg-electric-soft text-electric" : "bg-terracotta-soft text-terracotta",
          "text-micro font-semibold"
        )}>
          {isUser ? "U" : "H"}
        </div>

        {/* Content column */}
        <div className={cn("flex min-w-0 flex-col gap-2", isUser ? "max-w-[85%] items-end" : "flex-1")}>
          {/* Text bubble */}
          {textContent && (
            <div className={cn(
              "rounded-2xl px-4 py-3 text-body leading-relaxed shadow-soft",
              isUser
                ? "rounded-tr-md bg-electric-soft text-ink"
                : "rounded-tl-md border border-rule/70 bg-bg-elevated text-ink"
            )}>
              <MarkdownMessage text={textContent} />
              {isStreaming && !hasToolParts && (
                <span className="ml-1 inline-flex h-4 items-end gap-0.5 align-middle" aria-hidden="true">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-terracotta" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-terracotta [animation-delay:120ms]" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-terracotta [animation-delay:240ms]" />
                </span>
              )}
            </div>
          )}

          {/* Tool results - rendered outside the bubble for full width */}
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

// -- Quiz banner ---------------------------------------------------------------

interface QuizBannerProps {
  topic: string
  questionsAsked: number
  onEnd: () => void
}

function QuizBanner({ topic, questionsAsked, onEnd }: QuizBannerProps) {
  return (
    <div className="flex flex-shrink-0 items-center gap-3 border-b border-electric-soft bg-electric-soft/35 px-4 py-2">
      <span className="flex-1 truncate text-small font-medium text-electric">
        Quiz: {topic} | {questionsAsked}/5
      </span>
      <button
        type="button"
        onClick={onEnd}
        className="flex flex-shrink-0 items-center gap-1 rounded text-micro text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
      >
        <X size={12} />
        End quiz
      </button>
    </div>
  )
}

// -- Empty state ---------------------------------------------------------------

interface EmptyStateProps {
  handle: string
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onSuggestedPrompt: (prompt: string) => void
  onSlashSelect: (expanded: string) => void
}

function EmptyState({ handle, input, isLoading, onInputChange, onSubmit, onSuggestedPrompt, onSlashSelect }: EmptyStateProps) {
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
    <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-10">
      <div className="w-full max-w-[820px] space-y-7">
        <div className="text-center">
          <p className="text-micro font-semibold uppercase tracking-[0.22em] text-ink-faint">
            ORION · Hand
          </p>
          <h1 className="mt-3 font-fraunces text-h1 leading-tight text-ink">
            What are we working on today,{" "}
            <span className="text-terracotta">{handle}</span>?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-body text-ink-muted">
            Ask a question, work through a case, quiz yourself, or review high-yield mistakes.
          </p>
          <p className="mx-auto mt-3 max-w-xl rounded-full bg-surface-subtle px-4 py-2 text-small text-ink-muted">
            Educational only. No PHI: do not enter names, MRNs, DOBs, images, or patient identifiers.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <SlashPalette input={input} onSelect={onSlashSelect} />
            <div className={cn(
              "relative rounded-2xl border border-rule/70 bg-bg-elevated shadow-medium transition-all duration-300 ease-standard",
              "focus-within:border-electric/50 focus-within:ring-4 focus-within:ring-electric/10"
            )}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={onInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything — or type / for commands"
                rows={3}
                aria-label="Chat input"
                className="w-full resize-none overflow-hidden bg-transparent px-5 pb-14 pt-5 text-body text-ink placeholder:text-ink-muted focus:outline-none"
              />
              <div className="absolute bottom-3 right-3">
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "rounded-xl px-4 py-2 text-small font-semibold transition-all duration-300 ease-standard",
                    "bg-electric text-bg shadow-soft hover:-translate-y-0.5 hover:shadow-medium disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                  )}
                >
                  {isLoading ? "Sending" : "Ask"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_STARTS.map(({ label, prompt, helper, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => onSuggestedPrompt(prompt)}
                className={cn(
                  "group rounded-2xl border border-rule/70 bg-bg-elevated p-4 text-left shadow-soft",
                  "transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-medium",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                )}
              >
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-subtle text-electric transition-colors duration-300 group-hover:bg-electric-soft">
                  <Icon size={16} />
                </span>
                <span className="block text-small font-semibold text-ink">{label}</span>
                <span className="mt-1 block text-micro text-ink-muted">{helper}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onSuggestedPrompt(p)}
                className="rounded-full border border-rule/70 bg-bg-elevated px-3 py-1.5 text-micro text-ink-muted transition-colors duration-300 ease-standard hover:border-electric/40 hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              >
                {p}
              </button>
            ))}
            <a
              href="/topics"
              className="rounded-full border border-rule/70 bg-bg-elevated px-3 py-1.5 text-micro text-ink-muted transition-colors duration-300 ease-standard hover:border-electric/40 hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              Browse topic index
            </a>
          </div>
        </form>

        <TodaysPearl />
      </div>
    </div>
  )
}

// -- Conversation input bar ----------------------------------------------------

interface ConversationInputProps {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onSlashSelect: (expanded: string) => void
}

function ConversationInput({ input, isLoading, onInputChange, onSubmit, onSlashSelect }: ConversationInputProps) {
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
    <div className="flex-shrink-0 border-t border-rule/70 bg-bg/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-micro text-ink-muted">
          Educational only. No PHI: do not enter names, MRNs, DOBs, images, or patient identifiers.
        </p>
        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <div className="relative flex-1">
            <SlashPalette input={input} onSelect={onSlashSelect} />
            <div className={cn(
              "relative rounded-2xl border border-rule/70 bg-bg-elevated shadow-soft transition-all duration-300 ease-standard",
              "focus-within:border-electric/50 focus-within:ring-4 focus-within:ring-electric/10"
            )}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={onInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type / for commands, or ask a follow-up"
                rows={1}
                aria-label="Chat input"
                className="w-full resize-none overflow-hidden bg-transparent px-4 py-3 text-body text-ink placeholder:text-ink-muted focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className={cn(
              "flex-shrink-0 rounded-2xl px-4 py-3 text-small font-semibold transition-all duration-300 ease-standard",
              "bg-electric text-bg shadow-soft hover:-translate-y-0.5 hover:shadow-medium disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            )}
          >
            {isLoading ? "Sending" : "Send"}
          </button>
        </form>
      </div>
    </div>
  )
}

// -- Privacy banner ------------------------------------------------------------

function PrivacyBanner() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const ack = localStorage.getItem("surgicraft:privacy-acknowledged")
    if (!ack) setShow(true)
  }, [])
  if (!show) return null
  return (
    <div className="flex flex-shrink-0 items-center gap-3 border-b border-rule/70 bg-surface-subtle/70 px-4 py-2.5 text-small text-ink-muted">
      <span className="flex-1">
        Educational use only. Not for clinical decision-making. No PHI. Conversations are stored locally and never shared with faculty.
      </span>
      <button
        type="button"
        onClick={() => { localStorage.setItem("surgicraft:privacy-acknowledged", "1"); setShow(false) }}
        className="flex-shrink-0 rounded text-electric hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
      >
        Got it
      </button>
    </div>
  )
}

// -- Main ChatExperience -------------------------------------------------------

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

  const { messages, sendMessage, status, setMessages, clearError } = useChat({ transport })

  const [input, setInput] = useState("")
  const [handle, setHandle] = useState("doctor")
  const [msgMeta, setMsgMeta] = useState<Record<string, LocalMeta>>({})
  const [sendError, setSendError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const prevStatusRef = useRef(status)
  const lastAssistantMsgIdRef = useRef<string | null>(null)
  const persistedMessageSnapshotsRef = useRef<Map<string, string>>(new Map())

  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    migrateFromWeek1Key()
    setHandle(getDemoUser()?.handle ?? "doctor")
  }, [])

  useEffect(() => {
    setConvId(conversationId)

    if (!conversationId) {
      setConvTitle("")
      setMsgMeta({})
      setMessages([])
      persistedMessageSnapshotsRef.current = new Map()
      lastAssistantMsgIdRef.current = null
      setSendError(null)
      return
    }

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
      persistedMessageSnapshotsRef.current = new Map(
        restoredMessages.map((message) => [message.id, getMessageSnapshot(message)])
      )
    } else {
      setMessages([])
      persistedMessageSnapshotsRef.current = new Map()
      lastAssistantMsgIdRef.current = null
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

  // Persist AI SDK-owned UI messages into localStorage. User and assistant IDs
  // come from the SDK, while appendMessage upserts and preserves local flags.
  useEffect(() => {
    if (!convId) return

    const canPersistUserMessages = status === "streaming" || status === "ready"

    for (const message of messages) {
      if (message.role === "user" && !canPersistUserMessages) continue
      if (message.role === "assistant" && status === "submitted") continue

      const snapshot = getMessageSnapshot(message)
      if (persistedMessageSnapshotsRef.current.get(message.id) === snapshot) continue

      const storedMessage = uiMessageToChatMessageInput(message)
      if (!storedMessage) continue

      appendMessage(convId, storedMessage)
      persistedMessageSnapshotsRef.current.set(message.id, snapshot)
    }
  }, [messages, convId, status])

  useEffect(() => {
    if (status === "ready") {
      const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")
      if (lastAssistant && lastAssistant.id !== lastAssistantMsgIdRef.current) {
        lastAssistantMsgIdRef.current = lastAssistant.id
        if (prevStatusRef.current === "streaming" && quizState) {
          setQuizState((prev) => prev ? { ...prev, questionsAsked: prev.questionsAsked + 1 } : null)
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
    const messageIdsBeforeSend = new Set(messages.map((message) => message.id))

    setSendError(null)
    clearError()

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

    try {
      await sendMessage(
        { text },
        {
          body: {
            conversationId: currentConvId,
            ...(requestQuizState ? { quizMode: requestQuizState } : {}),
          },
        }
      )

      if (!conversationId) router.replace(`/c/${currentConvId}`)
    } catch (error) {
      console.error("[orion] Failed to send chat message", error)
      setMessages((currentMessages) =>
        currentMessages.filter((message) => messageIdsBeforeSend.has(message.id))
      )
      setInput(text)
      setSendError("Message could not be sent. Check the connection and try again.")
    }
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

  function handleSlashSelect(expanded: string) {
    setInput("")
    void doSend(expanded)
  }

  function handleQuizBegin(topic: string, intensity: string) {
    const nextQuizState = { topic, intensity, questionsAsked: 0 }
    setQuizState(nextQuizState)
    void doSend(`Begin the quiz on "${topic}" at ${intensity} intensity.`, nextQuizState)
  }

  function handleQuizEnd() {
    setQuizState(null)
    void doSend("End the quiz now and give me a summary of how I did.", null)
  }

  function handleCaseComplete(caseId: string, caseTitle: string) {
    void doSend(`I just completed the "${caseTitle}" case (${caseId}). What's the key teaching point I should take away?`)
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

      {sendError && (
        <div className="mx-4 mt-3 rounded-xl border border-wrong-soft bg-wrong-soft px-4 py-2 text-small text-ink shadow-soft" role="alert">
          {sendError}
        </div>
      )}

      {!hasMessages ? (
        <EmptyState
          handle={handle}
          input={input}
          isLoading={isLoading}
          onInputChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          onSuggestedPrompt={(p) => { setInput(""); void doSend(p) }}
          onSlashSelect={handleSlashSelect}
        />
      ) : (
        <div className="relative flex flex-col flex-1 overflow-hidden">
          <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 pb-4">
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
              {status === "submitted" && (
                <div className="flex gap-3" role="status" aria-live="polite">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-terracotta-soft text-micro font-semibold text-terracotta">
                    H
                  </div>
                  <div className="rounded-2xl rounded-tl-md border border-rule/70 bg-bg-elevated px-4 py-3 text-body text-ink-muted shadow-soft">
                    <span>ORION is thinking</span>
                    <span className="ml-1 inline-flex gap-0.5 align-middle" aria-hidden="true">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-ink-faint" />
                      <span className="h-1 w-1 animate-pulse rounded-full bg-ink-faint [animation-delay:120ms]" />
                      <span className="h-1 w-1 animate-pulse rounded-full bg-ink-faint [animation-delay:240ms]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {showScrollButton && (
            <button
              type="button"
              onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
              className={cn(
                "absolute bottom-20 right-4 md:right-8 z-10",
                "flex h-9 w-9 items-center justify-center rounded-full border border-rule/70 bg-bg-elevated shadow-medium",
                "text-ink-muted transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:text-ink",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              )}
              aria-label="Scroll to bottom"
            >
              <ArrowDown size={14} />
            </button>
          )}

          <ConversationInput
            input={input}
            isLoading={isLoading}
            onInputChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
            onSlashSelect={handleSlashSelect}
          />
        </div>
      )}
    </div>
  )
}

