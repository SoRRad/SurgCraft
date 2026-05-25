// Shared TypeScript types for the provider-agnostic LLM layer.
// All providers (mock, Anthropic, OpenAI, Azure, Bedrock, etc.) use these shapes.

import type { Role } from "@/lib/supabase/types"

// -- Shared primitives --------------------------------------------------------

export type ConversationMessage = {
  role: "user" | "assistant"
  content: string
}

export type Citation = {
  id: string
  label: string
  url?: string
}

// -- Tutor mode ---------------------------------------------------------------

export type TutorInput = {
  question: string
  userRole: Role
  conversationHistory: ConversationMessage[]
  kbContext?: string[]       // Retrieved KB chunks (populated in Phase 0C+)
  primaryGoal?: string
}

export type TutorResponse = {
  answer: string
  citations: Citation[]
  followUpSuggestions: string[]
  confidence: "high" | "medium" | "low"
  isUncertain: boolean      // Triggers "flag for faculty" template when true
}

// -- Case canvas --------------------------------------------------------------

export type CaseRevealInput = {
  userQuery: string
  caseId: string
  alreadyRevealedCards: string[]   // e.g. ["chief_complaint", "history"]
  totalCardsAvailable: number
}

export type CaseRevealResponse = {
  cardToReveal: string | null      // null = no match, ask a clarifying question
  message: string                  // Message to show the user
  shouldRevealManagement: boolean
  runningNarrative?: string        // Brief "what we've established" update
}

// -- Pimping simulator --------------------------------------------------------

export type PimpingIntensity = "gentle" | "standard" | "pyrotechnic"

export type PimpingInput = {
  topic: string
  intensity: PimpingIntensity
  userRole: Role
  previousQuestion?: string
  userAnswer?: string              // When grading a previous answer
}

export type PimpingResponse = {
  question?: string                // New question to ask
  grade?: 0 | 1 | 2 | 3           // Grade for the previous answer
  feedback?: string                // Attending-voice debrief
  rightAnswer?: string             // "The right way to answer on rounds"
}

// -- Pre-op prep --------------------------------------------------------------

export type PreOpInput = {
  procedure: string
  attending?: string
  userRole: Role
}

export type PreOpResponse = {
  anatomyRefresher: string
  approachOverview: string
  likelyIntraopQuestions: string[]
  pitfallsAndPearls: string[]
  references: string[]
}

// -- OR debrief ---------------------------------------------------------------

export type DebriefInput = {
  caseSummary: string
  userRole: Role
  conversationHistory: ConversationMessage[]
}

export type DebriefResponse = {
  reflectiveQuestion: string
  knowledgeGap?: string
  suggestion?: string
}

