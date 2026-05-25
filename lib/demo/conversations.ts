import type { UIMessage } from "ai"

// Conversation persistence: localStorage under "surgicraft:conversations".
// The storage key namespace is intentionally retained from the SurgiCraft era
// to preserve existing learner data through the ORION rebrand.
// SSR-safe: all functions return early if window is undefined.
// Capped at 50 conversations; oldest are auto-pruned beyond that.

export type Citation = {
  id: string
  label: string
  url?: string
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: string
  parts?: UIMessage["parts"]
  feedback?: "up" | "down" | null
  flagged?: boolean
  savedAsPearl?: boolean
  citations?: Citation[]
}

export type Conversation = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
  topicTags: string[]
}

export type SavedPearl = {
  id: string
  content: string
  conversationId: string
  conversationTitle: string
  messageId: string
  savedAt: string
}

export type LocalFlaggedMessage = {
  conversationId: string
  conversationTitle: string
  message: ChatMessage
}

export type LocalDataExport = {
  version: 1
  exportedAt: string
  conversations: Conversation[]
  pearls: SavedPearl[]
}

export type LocalDataImportResult = {
  conversationsImported: number
  pearlsImported: number
}

type ChatMessageInput = Omit<ChatMessage, "id" | "createdAt"> & {
  id?: string
  createdAt?: string
}

const CONV_KEY = "surgicraft:conversations"
const PEARLS_KEY = "surgicraft:saved-pearls"
const MAX_CONVERSATIONS = 50

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function asDateString(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback
  return Number.isNaN(new Date(value).getTime()) ? fallback : value
}

function getUIMessageText(message: UIMessage): string {
  return (message.parts ?? [])
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
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

function getUIMessageContentForStorage(message: UIMessage): string {
  const text = getUIMessageText(message).trim()
  const toolSummaries = (message.parts ?? [])
    .map(getToolPartSummary)
    .filter((summary): summary is string => Boolean(summary))

  return [text, ...toolSummaries].filter(Boolean).join("\n\n")
}

export function uiMessageToChatMessageInput(message: UIMessage): ChatMessageInput | null {
  if (message.role !== "user" && message.role !== "assistant" && message.role !== "system") {
    return null
  }

  const content = getUIMessageContentForStorage(message)
  const parts = message.parts ?? []
  if (!content && parts.length === 0) return null

  return {
    id: message.id,
    role: message.role,
    content: content || `${message.role} message`,
    parts,
  }
}

function readAll(): Conversation[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CONV_KEY)
    return raw ? (JSON.parse(raw) as Conversation[]) : []
  } catch {
    return []
  }
}

function writeAll(convs: Conversation[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CONV_KEY, JSON.stringify(convs))
    window.dispatchEvent(new CustomEvent("surgicraft:conversations:updated"))
  } catch {
    // localStorage quota exceeded: fail silently for the Phase 0B local prototype.
  }
}

export function listConversations(): Conversation[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getConversation(id: string): Conversation | null {
  return readAll().find((c) => c.id === id) ?? null
}

export function createConversation(firstMessage: string): Conversation {
  const now = new Date().toISOString()
  const conv: Conversation = {
    id: generateId(),
    title: firstMessage.length > 40 ? `${firstMessage.slice(0, 40)}...` : firstMessage,
    createdAt: now,
    updatedAt: now,
    messages: [],
    topicTags: [],
  }

  let convs = readAll()
  convs.unshift(conv)

  if (convs.length > MAX_CONVERSATIONS) {
    console.warn(
      `[orion] Conversation cap (${MAX_CONVERSATIONS}) reached; pruning oldest.`
    )
    convs = convs.slice(0, MAX_CONVERSATIONS)
  }

  writeAll(convs)
  return conv
}

export function updateConversationTitle(id: string, title: string): void {
  const cleanTitle = title.trim()
  if (!cleanTitle) return

  const convs = readAll()
  const idx = convs.findIndex((c) => c.id === id)
  if (idx === -1) return

  convs[idx] = { ...convs[idx], title: cleanTitle }
  writeAll(convs)
}

export function appendMessage(
  conversationId: string,
  message: ChatMessageInput
): ChatMessage {
  const full: ChatMessage = {
    id: message.id ?? generateId(),
    createdAt: message.createdAt ?? new Date().toISOString(),
    ...message,
  }

  const convs = readAll()
  const idx = convs.findIndex((c) => c.id === conversationId)
  if (idx === -1) return full

  const existingIdx = convs[idx].messages.findIndex((m) => m.id === full.id)
  const messages =
    existingIdx === -1
      ? [...convs[idx].messages, full]
      : convs[idx].messages.map((m, i) =>
          i === existingIdx
            ? {
                ...m,
                ...full,
                feedback: full.feedback ?? m.feedback,
                flagged: full.flagged ?? m.flagged,
                savedAsPearl: full.savedAsPearl ?? m.savedAsPearl,
              }
            : m
        )

  convs[idx] = {
    ...convs[idx],
    messages,
    updatedAt: new Date().toISOString(),
  }
  writeAll(convs)
  return full
}

export function updateMessage(
  conversationId: string,
  messageId: string,
  patch: Partial<ChatMessage>
): void {
  const convs = readAll()
  const idx = convs.findIndex((c) => c.id === conversationId)
  if (idx === -1) return

  const msgIdx = convs[idx].messages.findIndex((m) => m.id === messageId)
  if (msgIdx === -1) return

  convs[idx].messages[msgIdx] = { ...convs[idx].messages[msgIdx], ...patch }
  convs[idx].updatedAt = new Date().toISOString()
  writeAll(convs)
}

export function deleteConversation(id: string): void {
  writeAll(readAll().filter((c) => c.id !== id))
}

export function clearAllConversations(): void {
  writeAll([])
}

export function listFlaggedMessages(): LocalFlaggedMessage[] {
  return readAll()
    .flatMap((conversation) =>
      conversation.messages
        .filter((message) => message.flagged)
        .map((message) => ({
          conversationId: conversation.id,
          conversationTitle: conversation.title,
          message,
        }))
    )
    .sort(
      (a, b) =>
        new Date(b.message.createdAt).getTime() - new Date(a.message.createdAt).getTime()
    )
}

// Pearls

function readPearls(): SavedPearl[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(PEARLS_KEY)
    return raw ? (JSON.parse(raw) as SavedPearl[]) : []
  } catch {
    return []
  }
}

function writePearls(pearls: SavedPearl[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(PEARLS_KEY, JSON.stringify(pearls))
    window.dispatchEvent(new CustomEvent("surgicraft:pearls:updated"))
  } catch {}
}

export function savePearl(pearl: Omit<SavedPearl, "id" | "savedAt">): SavedPearl {
  const existing = readPearls().find((p) => p.messageId === pearl.messageId)
  if (existing) {
    const updated: SavedPearl = {
      ...existing,
      ...pearl,
      savedAt: new Date().toISOString(),
    }
    writePearls([updated, ...readPearls().filter((p) => p.id !== existing.id)])
    return updated
  }

  const full: SavedPearl = {
    id: generateId(),
    savedAt: new Date().toISOString(),
    ...pearl,
  }
  writePearls([full, ...readPearls()])
  return full
}

export function removePearl(id: string): void {
  writePearls(readPearls().filter((p) => p.id !== id))
}

export function removePearlByMessageId(messageId: string): void {
  writePearls(readPearls().filter((p) => p.messageId !== messageId))
}

export function listPearls(): SavedPearl[] {
  return readPearls()
}

// Import/export

export function exportLocalData(): LocalDataExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    conversations: readAll(),
    pearls: readPearls(),
  }
}

function normalizeRole(value: unknown): ChatMessage["role"] | null {
  return value === "user" || value === "assistant" || value === "system" ? value : null
}

function normalizeMessage(value: unknown): ChatMessage | null {
  if (!isRecord(value)) return null

  const role = normalizeRole(value.role)
  if (!role) return null

  const now = new Date().toISOString()
  const parts = Array.isArray(value.parts) ? (value.parts as UIMessage["parts"]) : undefined
  const content = asString(value.content)
  if (!content && !parts?.length) return null

  const feedback =
    value.feedback === "up" || value.feedback === "down" || value.feedback === null
      ? value.feedback
      : undefined

  const message: ChatMessage = {
    id: asString(value.id) || generateId(),
    role,
    content,
    createdAt: asDateString(value.createdAt, now),
    ...(parts ? { parts } : {}),
    ...(feedback !== undefined ? { feedback } : {}),
    ...(typeof value.flagged === "boolean" ? { flagged: value.flagged } : {}),
    ...(typeof value.savedAsPearl === "boolean" ? { savedAsPearl: value.savedAsPearl } : {}),
  }

  return message
}

function normalizeConversation(value: unknown): Conversation | null {
  if (!isRecord(value)) return null

  const now = new Date().toISOString()
  const createdAt = asDateString(value.createdAt, now)
  const messages = Array.isArray(value.messages)
    ? value.messages.map(normalizeMessage).filter((m): m is ChatMessage => Boolean(m))
    : []

  return {
    id: asString(value.id) || generateId(),
    title: asString(value.title, "Imported conversation").trim() || "Imported conversation",
    createdAt,
    updatedAt: asDateString(value.updatedAt, createdAt),
    messages,
    topicTags: Array.isArray(value.topicTags)
      ? value.topicTags.filter((tag): tag is string => typeof tag === "string")
      : [],
  }
}

function normalizePearl(value: unknown): SavedPearl | null {
  if (!isRecord(value)) return null

  const content = asString(value.content)
  if (!content) return null

  return {
    id: asString(value.id) || generateId(),
    content,
    conversationId: asString(value.conversationId),
    conversationTitle: asString(value.conversationTitle, "Imported conversation"),
    messageId: asString(value.messageId),
    savedAt: asDateString(value.savedAt, new Date().toISOString()),
  }
}

export function importLocalData(data: unknown): LocalDataImportResult {
  if (!isRecord(data)) {
    throw new Error("Expected an ORION local data export object.")
  }

  const incomingConversations = Array.isArray(data.conversations)
    ? data.conversations
        .map(normalizeConversation)
        .filter((c): c is Conversation => Boolean(c))
    : []
  const incomingPearls = Array.isArray(data.pearls)
    ? data.pearls.map(normalizePearl).filter((p): p is SavedPearl => Boolean(p))
    : []

  const conversationsById = new Map(readAll().map((conversation) => [conversation.id, conversation]))
  for (const conversation of incomingConversations) {
    conversationsById.set(conversation.id, conversation)
  }

  const mergedConversations = Array.from(conversationsById.values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_CONVERSATIONS)
  writeAll(mergedConversations)

  const pearlsById = new Map(readPearls().map((pearl) => [pearl.id, pearl]))
  for (const pearl of incomingPearls) {
    pearlsById.set(pearl.id, pearl)
  }

  const mergedPearls = Array.from(pearlsById.values()).sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  )
  writePearls(mergedPearls)

  return {
    conversationsImported: incomingConversations.length,
    pearlsImported: incomingPearls.length,
  }
}

// Clear all

export function clearAllData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CONV_KEY)
  localStorage.removeItem(PEARLS_KEY)
  localStorage.removeItem("surgicraft_demo_user")
  localStorage.removeItem("handcraft_user")
  localStorage.removeItem("surgicraft:privacy-acknowledged")
  window.dispatchEvent(new CustomEvent("surgicraft:conversations:updated"))
  window.dispatchEvent(new CustomEvent("surgicraft:pearls:updated"))
}
