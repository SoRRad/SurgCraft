// Conversation persistence — localStorage under "surgicraft:conversations".
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

const CONV_KEY = "surgicraft:conversations"
const PEARLS_KEY = "surgicraft:saved-pearls"
const MAX_CONVERSATIONS = 50

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
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
    // localStorage quota exceeded — fail silently
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
    title: firstMessage.length > 40 ? firstMessage.slice(0, 40) + "…" : firstMessage,
    createdAt: now,
    updatedAt: now,
    messages: [],
    topicTags: [],
  }

  let convs = readAll()
  convs.unshift(conv)

  if (convs.length > MAX_CONVERSATIONS) {
    console.warn(
      `[surgicraft] Conversation cap (${MAX_CONVERSATIONS}) reached — pruning oldest.`
    )
    convs = convs.slice(0, MAX_CONVERSATIONS)
  }

  writeAll(convs)
  return conv
}

export function updateConversationTitle(id: string, title: string): void {
  const convs = readAll()
  const idx = convs.findIndex((c) => c.id === id)
  if (idx === -1) return
  convs[idx] = { ...convs[idx], title, updatedAt: new Date().toISOString() }
  writeAll(convs)
}

export function appendMessage(conversationId: string, message: Omit<ChatMessage, "id" | "createdAt"> & { id?: string; createdAt?: string }): ChatMessage {
  const convs = readAll()
  const idx = convs.findIndex((c) => c.id === conversationId)
  if (idx === -1) return message as ChatMessage

  const full: ChatMessage = {
    id: message.id ?? generateId(),
    createdAt: message.createdAt ?? new Date().toISOString(),
    ...message,
  }

  convs[idx] = {
    ...convs[idx],
    messages: [...convs[idx].messages, full],
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

// ── Pearls ────────────────────────────────────────────────────────────────────

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
  } catch {}
}

export function savePearl(pearl: Omit<SavedPearl, "id" | "savedAt">): SavedPearl {
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

export function listPearls(): SavedPearl[] {
  return readPearls()
}

// ── Clear all ─────────────────────────────────────────────────────────────────

export function clearAllData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CONV_KEY)
  localStorage.removeItem(PEARLS_KEY)
  localStorage.removeItem("surgicraft_demo_user")
  localStorage.removeItem("handcraft_user")
  localStorage.removeItem("surgicraft:privacy-acknowledged")
  window.dispatchEvent(new CustomEvent("surgicraft:conversations:updated"))
}
