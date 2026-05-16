import { streamText, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateId } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { readFileSync } from "fs"
import { join } from "path"
import { getProvider } from "@/lib/llm"
import { checkSessionLimit, recordUsage } from "@/lib/llm/cost-guard"

let _systemPrompt: string | null = null
function getSystemPrompt(): string {
  if (_systemPrompt) return _systemPrompt
  try {
    _systemPrompt = readFileSync(join(process.cwd(), "prompts/tutor-chat.md"), "utf-8")
  } catch {
    _systemPrompt = "You are a hand surgery education tutor. Be helpful, accurate, and cite sources."
  }
  return _systemPrompt
}

export async function POST(req: Request) {
  const body = await req.json()
  const { messages, id, conversationId } = body
  const sessionId: string = id ?? conversationId ?? "anon"

  if (!checkSessionLimit(sessionId)) {
    return new Response(
      JSON.stringify({ error: "Session cost limit reached. Start a new conversation." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    )
  }

  const mode = process.env.NEXT_PUBLIC_APP_MODE
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (mode === "live" && apiKey) {
    const result = streamText({
      model: anthropic("claude-sonnet-4-5"),
      system: getSystemPrompt(),
      messages: await convertToModelMessages(messages),
      onFinish({ usage }) {
        recordUsage(sessionId, usage.inputTokens ?? 0, usage.outputTokens ?? 0)
      },
    })
    return result.toUIMessageStreamResponse()
  }

  // Demo mode: get mock response and simulate streaming via UIMessageStream protocol.
  const lastMessage = messages?.[messages.length - 1]
  const lastUserText: string = (lastMessage?.parts ?? [])
    .filter((p: { type: string }) => p.type === "text")
    .map((p: { type: string; text?: string }) => p.text ?? "")
    .join("") || lastMessage?.content || ""

  const mockResponse = await getProvider().respondToTutorQuestion({
    question: lastUserText,
    userRole: "PGY-2",
    conversationHistory: [],
  })

  const text = mockResponse.answer
  const chunkSize = 20

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const textId = generateId()
      writer.write({ type: "text-start", id: textId })
      for (let i = 0; i < text.length; i += chunkSize) {
        writer.write({ type: "text-delta", id: textId, delta: text.slice(i, i + chunkSize) })
        await new Promise((r) => setTimeout(r, 25))
      }
      writer.write({ type: "text-end", id: textId })
    },
  })

  return createUIMessageStreamResponse({ stream })
}
