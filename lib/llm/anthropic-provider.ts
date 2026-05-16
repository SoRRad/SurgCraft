// Anthropic implementation of LLMProvider — server-only.
// Uses Vercel AI SDK + @ai-sdk/anthropic with claude-sonnet-4-5.

if (typeof window !== "undefined") {
  throw new Error(
    "[anthropic-provider] This module is server-only. Do not import it in client components."
  )
}

import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { readFileSync } from "fs"
import { join } from "path"
import type { LLMProvider } from "./provider"
import type {
  TutorInput, TutorResponse,
  CaseRevealInput, CaseRevealResponse,
  PimpingInput, PimpingResponse,
  PreOpInput, PreOpResponse,
  DebriefInput, DebriefResponse,
  Citation,
} from "./types"
import { MockProvider } from "./mock-provider"

const _mock = new MockProvider()

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

function parseCitations(text: string): Citation[] {
  const pattern = /\[([^\]]+?),\s*(\d{4})\]/g
  const seen = new Set<string>()
  const citations: Citation[] = []
  let match
  while ((match = pattern.exec(text)) !== null) {
    const label = `${match[1]}, ${match[2]}`
    if (!seen.has(label)) {
      seen.add(label)
      citations.push({
        id: label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        label,
      })
    }
  }
  return citations
}

export class AnthropicProvider implements LLMProvider {
  async respondToTutorQuestion(input: TutorInput): Promise<TutorResponse> {
    const messages = [
      ...input.conversationHistory,
      { role: "user" as const, content: input.question },
    ]

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-5"),
      system: getSystemPrompt(),
      messages,
    })

    return {
      answer: text,
      citations: parseCitations(text),
      followUpSuggestions: [],
      confidence: "high",
      isUncertain: false,
    }
  }

  // Other methods delegate to MockProvider until Part 2 wires them up.
  async revealCaseCard(input: CaseRevealInput): Promise<CaseRevealResponse> {
    return _mock.revealCaseCard(input)
  }

  async gradePimpingAnswer(input: PimpingInput): Promise<PimpingResponse> {
    return _mock.gradePimpingAnswer(input)
  }

  async generatePreOpPrep(input: PreOpInput): Promise<PreOpResponse> {
    return _mock.generatePreOpPrep(input)
  }

  async summarizeDebrief(input: DebriefInput): Promise<DebriefResponse> {
    return _mock.summarizeDebrief(input)
  }
}
