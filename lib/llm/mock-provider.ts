// Mock LLM provider — implements LLMProvider using local demo engine only.
// No fetch, no SDK, no network calls. Works with zero environment variables.

import type { LLMProvider } from "./provider"
import type {
  TutorInput, TutorResponse,
  CaseRevealInput, CaseRevealResponse,
  PimpingInput, PimpingResponse,
  PreOpInput, PreOpResponse,
  DebriefInput, DebriefResponse,
} from "./types"
import {
  findBestMatch,
  roleDepthNote,
  getPimpingQuestion,
} from "./local-demo-engine"

export class MockProvider implements LLMProvider {

  async respondToTutorQuestion(input: TutorInput): Promise<TutorResponse> {
    const match = findBestMatch(input.question)

    if (!match) {
      return {
        answer:
          "I'm not sure based on what I have — that topic may not be in the current demo knowledge base. " +
          "Want me to flag this for faculty review? In the full app, this would trigger RAG retrieval across the entire knowledge base.",
        citations: [],
        followUpSuggestions: [
          "Try asking about flexor tendon zones, Kanavel's signs, fight bites, mallet finger, or distal radius fractures.",
          "Or ask me to run a pimping session on hand surgery anatomy.",
        ],
        confidence: "low",
        isUncertain: true,
      }
    }

    const depthNote = roleDepthNote(input.userRole)

    return {
      answer: match.fullAnswer + depthNote,
      citations: match.citations,
      followUpSuggestions: match.followUps,
      confidence: "high",
      isUncertain: false,
    }
  }

  async revealCaseCard(input: CaseRevealInput): Promise<CaseRevealResponse> {
    const q = input.userQuery.toLowerCase()

    const cardMap: Record<string, string[]> = {
      history: ["history", "hpi", "when", "how", "what happened", "pmh", "medications", "meds", "allerg", "tetanus", "vaccines", "social"],
      exam: ["exam", "look", "inspect", "swelling", "rom", "neurovascular", "tender", "pulse", "sensation"],
      imaging: ["x-ray", "xray", "imaging", "radiograph", "ct", "mri", "film", "picture", "image"],
      labs: ["labs", "cbc", "wbc", "crp", "esr", "blood", "cultures", "white"],
      management: ["manage", "treatment", "plan", "what do", "antibiotics", "surgery", "admit", "discharge", "next step"],
    }

    for (const [card, keywords] of Object.entries(cardMap)) {
      if (input.alreadyRevealedCards.includes(card)) continue
      if (keywords.some((kw) => q.includes(kw))) {
        const managementAllowed =
          card !== "management" ||
          input.alreadyRevealedCards.length >= 3 ||
          q.includes("management") ||
          q.includes("what do we do") ||
          q.includes("treat")

        if (!managementAllowed) {
          return {
            cardToReveal: null,
            message: "Let's gather more information first. You've uncovered " +
              input.alreadyRevealedCards.length + " card(s) so far. " +
              "Try exploring history, exam, or imaging before management.",
            shouldRevealManagement: false,
          }
        }

        return {
          cardToReveal: card,
          message: card === "management"
            ? "You've worked through enough of the case — here's the management approach."
            : `Good call. Here's the ${card}.`,
          shouldRevealManagement: card === "management",
          runningNarrative: this._buildNarrative(input.alreadyRevealedCards, card),
        }
      }
    }

    return {
      cardToReveal: null,
      message: "What would you like to explore? You can ask about history, physical exam, imaging, labs, or management when you're ready.",
      shouldRevealManagement: false,
    }
  }

  async gradePimpingAnswer(input: PimpingInput): Promise<PimpingResponse> {
    if (!input.userAnswer) {
      const q = getPimpingQuestion(input.topic, input.intensity)
      return { question: q.question }
    }

    const q = getPimpingQuestion(input.topic, input.intensity)
    const answer = input.userAnswer.toLowerCase()
    const hitCount = q.keyPoints.filter((kp) =>
      answer.includes(kp.toLowerCase())
    ).length

    const grade = (hitCount >= q.keyPoints.length * 0.8 ? 3
      : hitCount >= q.keyPoints.length * 0.5 ? 2
      : hitCount > 0 ? 1
      : 0) as 0 | 1 | 2 | 3

    const gradePrefix = ["Not quite.", "Getting there.", "Good — you're close.", "Excellent."][grade]

    return {
      grade,
      feedback: `${gradePrefix} You mentioned ${hitCount} of ${q.keyPoints.length} key points.`,
      rightAnswer: q.rightAnswer,
      question: getPimpingQuestion(input.topic, input.intensity).question,
    }
  }

  async generatePreOpPrep(input: PreOpInput): Promise<PreOpResponse> {
    const proc = input.procedure.toLowerCase()

    if (proc.includes("radius") || proc.includes("wrist")) {
      return {
        anatomyRefresher:
          "The volar surface of the distal radius is accessed through the Henry approach. " +
          "The FCR tendon sheath guides the interval. The pronator quadratus (PQ) covers the distal radius and is elevated off its radial border. " +
          "Key structures: radial artery (ulnar to FCR — retract radially), FPL tendon (deep and ulnar), palmar cutaneous branch of median nerve (~5cm proximal to wrist crease).",
        approachOverview:
          "1. Longitudinal incision over FCR, extended to wrist crease.\n" +
          "2. Enter FCR tendon sheath; divide floor to expose PQ.\n" +
          "3. Elevate PQ off radial border → subperiosteal exposure of fracture.\n" +
          "4. Contour plate to volar cortex. Confirm with fluoroscopy.\n" +
          "5. Verify: dorsal cortex clearance, articular surface, radial tilt, height.",
        likelyIntraopQuestions: [
          "What's the acceptable volar tilt on lateral?",
          "How do you assess DRUJ stability intraoperatively?",
          "If the PQ won't cover the plate, what do you do?",
          "What are the fluoroscopic views you need?",
        ],
        pitfallsAndPearls: [
          "Screw penetration of the dorsal cortex → extensor tendon attrition",
          "Failure to restore radial height → DRUJ incongruity",
          "Always check DRUJ stability before closing — address intraoperatively if unstable",
          "Skyline view confirms dorsal screw clearance",
        ],
        references: [
          "AAOS Clinical Practice Guideline on Distal Radius Fractures",
          "Wolfe et al., Green's Operative Hand Surgery — distal radius chapter",
        ],
      }
    }

    return {
      anatomyRefresher:
        `This is a demo — full pre-op prep for "${input.procedure}" will be available when the LLM is connected in Phase 0B/0C.`,
      approachOverview: "Connect an LLM provider to get real-time procedure prep.",
      likelyIntraopQuestions: ["Phase 0B will include dynamic question generation."],
      pitfallsAndPearls: ["Canned content for distal radius ORIF is available now — try that procedure."],
      references: [],
    }
  }

  async summarizeDebrief(input: DebriefInput): Promise<DebriefResponse> {
    const history = input.conversationHistory
    const lastUserMessage = [...history].reverse().find((m) => m.role === "user")

    if (!lastUserMessage || history.length < 2) {
      return {
        reflectiveQuestion: "Walk me through what happened in the OR today — start with the indication.",
      }
    }

    return {
      reflectiveQuestion: "What was the key decision point in the case? What would you do differently if you were primary?",
      suggestion:
        "When you can articulate the indication and the key decision without hesitation, you're ready to be primary.",
    }
  }

  private _buildNarrative(revealed: string[], newCard: string): string {
    const all = [...revealed, newCard]
    const labels: Record<string, string> = {
      chief_complaint: "chief complaint",
      history: "history",
      exam: "physical exam",
      imaging: "imaging",
      labs: "labs",
      management: "management",
    }
    const parts = all.map((c) => labels[c] ?? c).filter(Boolean)
    return `What we've established: ${parts.join(", ")}.`
  }
}
