import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { z } from "zod"
import { createMockUIMessageStreamResponse } from "@/lib/llm/mock-stream"
import { checkSessionLimit, recordUsage } from "@/lib/llm/cost-guard"
import { getStreamingProviderConfig } from "@/lib/llm/streaming-provider"

const MAX_USER_MESSAGE_CHARS = 4000
const MAX_MESSAGES_FOR_MODEL = 20
const MAX_APPROX_INPUT_TOKENS = 16_000

const MessagePartSchema = z.object({ type: z.string() }).passthrough()

const MessageSchema = z
  .object({
    id: z.string().optional(),
    role: z.enum(["system", "user", "assistant"]),
    content: z.string().optional(),
    parts: z.array(MessagePartSchema).optional(),
  })
  .passthrough()
  .refine((message) => typeof message.content === "string" || Array.isArray(message.parts), {
    message: "Each message must include content or parts.",
  })

const QuizModeSchema = z.object({
  topic: z.string().min(1).max(160),
  intensity: z.enum(["gentle", "standard", "pyrotechnic"]),
  questionsAsked: z.number().int().min(0).max(5),
})

const ChatRequestSchema = z
  .object({
    messages: z.array(MessageSchema).min(1).max(100),
    id: z.string().min(1).max(200).optional(),
    conversationId: z.string().min(1).max(200).optional(),
    quizMode: QuizModeSchema.optional(),
  })
  .passthrough()

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function getMessageText(message: z.infer<typeof MessageSchema>): string {
  const partText =
    message.parts
      ?.filter((part): part is typeof part & { text: string } => part.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("") ?? ""

  return partText || message.content || ""
}

function estimateApproxInputTokens(messages: z.infer<typeof MessageSchema>[], systemPrompt: string): number {
  const inputChars = messages.reduce(
    (total, message) => total + JSON.stringify(message).length,
    systemPrompt.length
  )

  return Math.ceil(inputChars / 4)
}

export async function POST(req: Request) {
  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return jsonError("Malformed JSON request body.", 400)
  }

  const parsedBody = ChatRequestSchema.safeParse(rawBody)
  if (!parsedBody.success) {
    return jsonError("Malformed chat request.", 400)
  }

  const { messages, id, conversationId, quizMode } = parsedBody.data
  const sessionId: string = conversationId ?? id ?? "anon"
  const newestUserMessage = [...messages].reverse().find((message) => message.role === "user")

  if (!newestUserMessage) {
    return jsonError("Chat request must include a user message.", 400)
  }

  const newestUserText = getMessageText(newestUserMessage)
  if (newestUserText.length > MAX_USER_MESSAGE_CHARS) {
    return jsonError(`Newest user message must be ${MAX_USER_MESSAGE_CHARS} characters or fewer.`, 413)
  }

  const modelMessages = messages.slice(-MAX_MESSAGES_FOR_MODEL)
  const providerConfig = getStreamingProviderConfig(quizMode)

  if (!checkSessionLimit(sessionId)) {
    return jsonError("Session cost limit reached. Start a new conversation.", 429)
  }

  if (providerConfig.mode === "anthropic") {
    const approxInputTokens = estimateApproxInputTokens(modelMessages, providerConfig.systemPrompt)

    if (approxInputTokens > MAX_APPROX_INPUT_TOKENS) {
      return jsonError("Request is too large for this development chat endpoint.", 413)
    }

    const result = streamText({
      model: providerConfig.model,
      system: providerConfig.systemPrompt,
      messages: await convertToModelMessages(modelMessages as UIMessage[], {
        tools: providerConfig.tools,
        ignoreIncompleteToolCalls: true,
      }),
      tools: providerConfig.tools,
      maxOutputTokens: providerConfig.maxOutputTokens,
      onFinish({ usage }) {
        recordUsage(sessionId, usage.inputTokens ?? 0, usage.outputTokens ?? 0)
      },
    })
    return result.toUIMessageStreamResponse()
  }

  // Demo mode: keyword-triggered tool simulation with mock text response.
  return createMockUIMessageStreamResponse(newestUserText)
}
