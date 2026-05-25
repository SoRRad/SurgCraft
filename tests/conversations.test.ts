import { beforeEach, describe, expect, it, vi } from "vitest"
import type { UIMessage } from "ai"
import {
  appendMessage,
  clearAllData,
  createConversation,
  exportLocalData,
  importLocalData,
  listConversations,
  listPearls,
  removePearlByMessageId,
  savePearl,
  uiMessageToChatMessageInput,
} from "@/lib/demo/conversations"

class MemoryStorage {
  private store = new Map<string, string>()

  getItem(key: string) {
    return this.store.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.store.set(key, value)
  }

  removeItem(key: string) {
    this.store.delete(key)
  }
}

beforeEach(() => {
  const localStorage = new MemoryStorage()
  vi.stubGlobal("localStorage", localStorage)
  vi.stubGlobal("window", {
    localStorage,
    dispatchEvent: vi.fn(),
  })
})

describe("local conversation and pearl helpers", () => {
  it("upserts messages by id instead of duplicating them", () => {
    const conversation = createConversation("Fight bite basics")

    appendMessage(conversation.id, { id: "m1", role: "user", content: "first" })
    appendMessage(conversation.id, { id: "m1", role: "user", content: "updated" })

    const messages = listConversations()[0].messages
    expect(messages).toHaveLength(1)
    expect(messages[0].content).toBe("updated")
  })

  it("exports and imports conversations and pearls", () => {
    const conversation = createConversation("Pearl conversation")
    appendMessage(conversation.id, { id: "a1", role: "assistant", content: "A useful answer" })
    savePearl({
      content: "A useful answer",
      conversationId: conversation.id,
      conversationTitle: conversation.title,
      messageId: "a1",
    })

    const exported = exportLocalData()
    clearAllData()
    expect(listConversations()).toHaveLength(0)

    const result = importLocalData(exported)

    expect(result).toMatchObject({ conversationsImported: 1, pearlsImported: 1 })
    expect(listConversations()).toHaveLength(1)
    expect(listPearls()).toHaveLength(1)
  })

  it("removes saved pearls by assistant message id", () => {
    const conversation = createConversation("Remove pearl")
    savePearl({
      content: "Remove me",
      conversationId: conversation.id,
      conversationTitle: conversation.title,
      messageId: "a1",
    })
    savePearl({
      content: "Keep me",
      conversationId: conversation.id,
      conversationTitle: conversation.title,
      messageId: "a2",
    })

    removePearlByMessageId("a1")

    expect(listPearls()).toHaveLength(1)
    expect(listPearls()[0]).toMatchObject({ content: "Keep me", messageId: "a2" })
  })

  it("does not duplicate pearls for the same assistant message id", () => {
    const conversation = createConversation("Duplicate pearl")
    savePearl({
      content: "First save",
      conversationId: conversation.id,
      conversationTitle: conversation.title,
      messageId: "a1",
    })
    savePearl({
      content: "Updated save",
      conversationId: conversation.id,
      conversationTitle: conversation.title,
      messageId: "a1",
    })

    expect(listPearls()).toHaveLength(1)
    expect(listPearls()[0]).toMatchObject({ content: "Updated save", messageId: "a1" })
  })

  it("rejects malformed imports cleanly", () => {
    expect(() => importLocalData(null)).toThrow("Expected a SurgiCraft local data export object.")
  })

  it("converts AI SDK user messages into local persisted messages", () => {
    const stored = uiMessageToChatMessageInput({
      id: "sdk-user-1",
      role: "user",
      parts: [{ type: "text", text: "How do I manage a fight bite?" }],
    } as UIMessage)

    expect(stored).toMatchObject({
      id: "sdk-user-1",
      role: "user",
      content: "How do I manage a fight bite?",
    })
  })

  it("keeps useful tool result summaries when persisting assistant messages", () => {
    const stored = uiMessageToChatMessageInput({
      id: "sdk-assistant-1",
      role: "assistant",
      parts: [
        { type: "text", text: "Here is the case." },
        {
          type: "tool-launch_case",
          state: "output-available",
          output: { id: "001-fight-bite", title: "The bar fight" },
        },
      ],
    } as unknown as UIMessage)

    expect(stored?.content).toContain("Here is the case.")
    expect(stored?.content).toContain('Tool result: launched case "The bar fight" (001-fight-bite).')
  })
})
