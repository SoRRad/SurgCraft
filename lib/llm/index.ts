// Entry point for the LLM provider layer.
// Returns MockProvider (demo mode) or AnthropicProvider (live mode).
// Phase 0C: will upgrade to RAG-backed provider with pgvector.

import type { LLMProvider } from "./provider"
import { MockProvider } from "./mock-provider"

let _provider: LLMProvider | null = null

export function getProvider(): LLMProvider {
  if (_provider) return _provider

  const mode = process.env.NEXT_PUBLIC_APP_MODE
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (mode === "live" && apiKey) {
    // Dynamic require keeps the server-only module out of client bundles.
    // This function is only called server-side (API routes, server actions).
    const { AnthropicProvider } = require("./anthropic-provider") as typeof import("./anthropic-provider")
    _provider = new AnthropicProvider()
    return _provider
  }

  if (mode === "live" && !apiKey) {
    console.warn(
      "[surgicraft] NEXT_PUBLIC_APP_MODE=live but ANTHROPIC_API_KEY is not set. " +
        "Falling back to mock provider."
    )
  }

  _provider = new MockProvider()
  return _provider
}

export type { LLMProvider }
export type {
  TutorInput, TutorResponse,
  CaseRevealInput, CaseRevealResponse,
  PimpingInput, PimpingResponse,
  PreOpInput, PreOpResponse,
  DebriefInput, DebriefResponse,
} from "./types"
