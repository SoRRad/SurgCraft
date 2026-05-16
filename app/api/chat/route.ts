import { streamText, convertToModelMessages } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { readFileSync } from "fs"
import { join } from "path"
import { allTools } from "@/lib/llm/tools"
import { createMockUIMessageStreamResponse } from "@/lib/llm/mock-stream"
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

function buildSystemPrompt(quizMode?: { topic: string; intensity: string; questionsAsked: number }): string {
  const base = getSystemPrompt()
  if (!quizMode) return base

  const intensityDesc =
    quizMode.intensity === "pyrotechnic"
      ? "attending-voice rapid-fire pimp questions"
      : quizMode.intensity === "gentle"
      ? "encouraging questions with hints"
      : "balanced quiz questions"

  return (
    base +
    `\n\n## Current quiz mode\nYou are now in quiz mode for the topic: "${quizMode.topic}" (${quizMode.intensity} — ${intensityDesc}).\n` +
    `Questions asked so far: ${quizMode.questionsAsked}/5.\n` +
    "Ask one question at a time. After the user answers, briefly grade (correct/partial/incorrect), give a one-sentence explanation, then ask the next question. " +
    "After 5 questions, summarize the score and key learning points. Do NOT call suggest_followups during quiz mode."
  )
}

export async function POST(req: Request) {
  const body = await req.json()
  const { messages, id, conversationId, quizMode } = body
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
      system: buildSystemPrompt(quizMode),
      messages: await convertToModelMessages(messages),
      tools: allTools,
      onFinish({ usage }) {
        recordUsage(sessionId, usage.inputTokens ?? 0, usage.outputTokens ?? 0)
      },
    })
    return result.toUIMessageStreamResponse()
  }

  // Demo mode: keyword-triggered tool simulation with mock text response.
  const lastMessage = messages?.[messages.length - 1]
  const lastUserText: string =
    (lastMessage?.parts ?? [])
      .filter((p: { type: string }) => p.type === "text")
      .map((p: { type: string; text?: string }) => p.text ?? "")
      .join("") ||
    lastMessage?.content ||
    ""

  return createMockUIMessageStreamResponse(lastUserText)
}
