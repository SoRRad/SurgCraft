// Provider-agnostic LLM interface.
// Implement this interface to add a new backend (Anthropic, OpenAI, Azure, etc.)
// without changing any app-level code.

import type {
  TutorInput, TutorResponse,
  CaseRevealInput, CaseRevealResponse,
  PimpingInput, PimpingResponse,
  PreOpInput, PreOpResponse,
  DebriefInput, DebriefResponse,
} from "./types"

export interface LLMProvider {
  /** Tutor mode: answer a hand surgery question with citations */
  respondToTutorQuestion(input: TutorInput): Promise<TutorResponse>

  /** Case canvas: decide which card to reveal based on the user's query */
  revealCaseCard(input: CaseRevealInput): Promise<CaseRevealResponse>

  /** Pimping simulator: generate a question OR grade a previous answer */
  gradePimpingAnswer(input: PimpingInput): Promise<PimpingResponse>

  /** Pre-op prep: return structured prep for a named procedure */
  generatePreOpPrep(input: PreOpInput): Promise<PreOpResponse>

  /** OR debrief: ask a reflective follow-up question */
  summarizeDebrief(input: DebriefInput): Promise<DebriefResponse>
}
