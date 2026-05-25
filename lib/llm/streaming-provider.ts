// Server-only streaming model configuration for the chat route.
// Add future providers here so API routes do not hardcode vendor model setup.

if (typeof window !== "undefined") {
  throw new Error(
    "[streaming-provider] This module is server-only. Do not import it in client components."
  )
}

import { anthropic } from "@ai-sdk/anthropic"
import type { LanguageModel } from "ai"
import { readFileSync } from "fs"
import { join } from "path"
import { allTools } from "@/lib/llm/tools"
import {
  logProviderFallback,
  resolveLLMProvider,
  type LLMProviderId,
} from "@/lib/llm/provider-selection"

export const DEFAULT_MAX_OUTPUT_TOKENS = 1200

export type TutorQuizMode = {
  topic: string
  intensity: "gentle" | "standard" | "pyrotechnic"
  questionsAsked: number
}

type BaseStreamingConfig = {
  mode: LLMProviderId
  systemPrompt: string
  tools: typeof allTools
  maxOutputTokens: number
}

export type MockStreamingConfig = BaseStreamingConfig & {
  mode: "mock"
  model?: never
}

export type LiveStreamingConfig = BaseStreamingConfig & {
  mode: "anthropic"
  model: LanguageModel
}

export type StreamingProviderConfig = MockStreamingConfig | LiveStreamingConfig

let _systemPrompt: string | null = null

export function getTutorSystemPrompt(): string {
  if (_systemPrompt) return _systemPrompt
  try {
    _systemPrompt = readFileSync(join(process.cwd(), "prompts/tutor-chat.md"), "utf-8")
  } catch {
    _systemPrompt = "You are a hand surgery education tutor. Be helpful, accurate, and cite sources."
  }
  return _systemPrompt
}

export function buildTutorSystemPrompt(quizMode?: TutorQuizMode): string {
  const base = getTutorSystemPrompt()
  if (!quizMode) return base

  const intensityDesc =
    quizMode.intensity === "pyrotechnic"
      ? "attending-voice rapid-fire pimp questions"
      : quizMode.intensity === "gentle"
      ? "encouraging questions with hints"
      : "balanced quiz questions"

  return (
    base +
    `\n\n## Current quiz mode\nYou are now in quiz mode for the topic: "${quizMode.topic}" (${quizMode.intensity} - ${intensityDesc}).\n` +
    `Questions asked so far: ${quizMode.questionsAsked}/5.\n` +
    "Ask one question at a time. After the user answers, briefly grade (correct/partial/incorrect), give a one-sentence explanation, then ask the next question. " +
    "After 5 questions, summarize the score and key learning points. Do NOT call suggest_followups during quiz mode."
  )
}

function getAnthropicModel(): LanguageModel {
  return anthropic("claude-sonnet-4-5")
}

export function getStreamingProviderConfig(quizMode?: TutorQuizMode): StreamingProviderConfig {
  const selection = resolveLLMProvider()
  logProviderFallback(selection)

  const base = {
    systemPrompt: buildTutorSystemPrompt(quizMode),
    tools: allTools,
    maxOutputTokens: DEFAULT_MAX_OUTPUT_TOKENS,
  }

  if (selection.provider === "anthropic") {
    return {
      ...base,
      mode: "anthropic",
      model: getAnthropicModel(),
    }
  }

  return {
    ...base,
    mode: "mock",
  }
}
