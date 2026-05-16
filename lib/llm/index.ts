// Entry point for the LLM provider layer.
// In Phase 0A, always returns the mock provider.
// In later phases, will branch on NEXT_PUBLIC_APP_MODE / provider env vars.

import type { LLMProvider } from "./provider"
import { MockProvider } from "./mock-provider"

let _provider: LLMProvider | null = null

export function getProvider(): LLMProvider {
  if (_provider) return _provider

  // Phase 0A: always use mock
  // Phase 0B: check NEXT_PUBLIC_APP_MODE === "live" → load AnthropicProvider
  // Phase 0C: check for pgvector + Supabase → upgrade to RAG-backed provider
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
