// Entry point for the LLM provider layer.
// Returns MockProvider (demo mode) or AnthropicProvider (live mode).
// Phase 0C: will upgrade to RAG-backed provider with pgvector.

import type { LLMProvider } from "./provider"
import { MockProvider } from "./mock-provider"
import { logProviderFallback, resolveLLMProvider } from "./provider-selection"

let _provider: LLMProvider | null = null

export function getProvider(): LLMProvider {
  if (_provider) return _provider

  const selection = resolveLLMProvider()
  logProviderFallback(selection)

  if (selection.provider === "anthropic") {
    // Dynamic require keeps the server-only module out of client bundles.
    // This function is only called server-side (API routes, server actions).
    const { AnthropicProvider } = require("./anthropic-provider") as typeof import("./anthropic-provider")
    _provider = new AnthropicProvider()
    return _provider
  }

  _provider = new MockProvider()
  return _provider
}

export type { LLMProvider }
export type { LLMProviderId, ProviderSelection } from "./provider-selection"
export type {
  TutorInput, TutorResponse,
  CaseRevealInput, CaseRevealResponse,
  PimpingInput, PimpingResponse,
  PreOpInput, PreOpResponse,
  DebriefInput, DebriefResponse,
} from "./types"
