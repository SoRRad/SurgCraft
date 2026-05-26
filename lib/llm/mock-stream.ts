// Mock streaming helper - simulates tool calls from the LLM using keyword detection.
// Used when LLM_PROVIDER resolves to mock or a live provider is missing credentials.

import { createUIMessageStream, createUIMessageStreamResponse, generateId } from "ai"
import { MISTAKE_MUSEUM, DO_NOT_MISS, PEARLS } from "@/lib/demo/demo-content"
import { findTutorAnswer } from "@/lib/llm/local-demo-engine"
import case001 from "@/content/cases/001-fight-bite.json"
import case002 from "@/content/cases/002-mallet-finger.json"
import case003 from "@/content/cases/003-distal-radius.json"
import { OPPORTUNITIES, OPPORTUNITY_BUNDLES } from "@/lib/opportunities/data"
import { getUpcomingDeadlines, getFundingOpportunities } from "@/lib/opportunities/deadlines"

type MockCase = {
  id: string
  title: string
  stem: string
  difficulty: string
  estimatedMinutes: number
  tags: string[]
}

const CASE_MAP: Record<string, MockCase> = {
  "001-fight-bite": case001 as MockCase,
  "002-mallet-finger": case002 as MockCase,
  "003-distal-radius": case003 as MockCase,
}

type MockToolCall =
  | { tool: "launch_case"; args: { case_id: string; reason: string } }
  | { tool: "show_pearl"; args: { pearl_id: string } }
  | { tool: "show_mistake"; args: { mistake_id: string } }
  | { tool: "show_donotmiss"; args: { donotmiss_id: string } }
  | { tool: "start_quiz"; args: { topic: string; intensity: string } }
  | { tool: "suggest_followups"; args: { chips: string[] } }
  | { tool: "show_opportunity_list"; args: { query?: string; maxResults: number } }
  | { tool: "show_deadline_list"; args: { days: number; maxResults: number } }
  | { tool: "show_opportunity_bundle"; args: { bundle_id: string } }

function detectMockTools(userMessage: string): MockToolCall[] {
  const q = userMessage.toLowerCase()
  const tools: MockToolCall[] = []

  // Case launch detection
  const wantsCase =
    q.includes("walk me through") ||
    q.includes("work through") ||
    q.includes("guide me") ||
    q.includes("show me a case") ||
    q.includes("case study")

  if (wantsCase) {
    let case_id = "001-fight-bite"
    let reason = "User requested a fight bite case walkthrough."

    if (q.includes("mallet") || q.includes("basketball") || q.includes("dip") || q.includes("droop")) {
      case_id = "002-mallet-finger"
      reason = "User requested a mallet finger case."
    } else if (
      q.includes("wrist") ||
      q.includes("radius") ||
      q.includes("foosh") ||
      q.includes("fracture") ||
      q.includes("colles")
    ) {
      case_id = "003-distal-radius"
      reason = "User requested a distal radius fracture case."
    }

    tools.push({ tool: "launch_case", args: { case_id, reason } })
  }

  // Quiz detection
  if (
    (q.includes("quiz") || q.includes("drill") || q.includes("test me") || q.includes("pimp")) &&
    !wantsCase
  ) {
    const topic = extractTopic(q)
    const intensity = q.includes("pyrotechnic") || q.includes("hard")
      ? "pyrotechnic"
      : q.includes("gentle") || q.includes("easy")
      ? "gentle"
      : "standard"
    tools.push({ tool: "start_quiz", args: { topic, intensity } })
  }

  // Mistake detection (when asking about mistakes without quiz mode)
  if ((q.includes("mistake") || q.includes("error") || q.includes("wrong")) && !q.includes("quiz")) {
    if (q.includes("fight bite") || q.includes("mcp") || q.includes("close")) {
      tools.push({ tool: "show_mistake", args: { mistake_id: "fight-bite-closed" } })
    } else if (q.includes("mallet") || q.includes("splint") || q.includes("pip")) {
      tools.push({ tool: "show_mistake", args: { mistake_id: "pip-splinted" } })
    } else if (q.includes("median") || q.includes("nerve") || q.includes("carpal")) {
      tools.push({ tool: "show_mistake", args: { mistake_id: "median-nerve-watched" } })
    } else if (q.includes("tenosynovitis") || q.includes("kanavel") || q.includes("sheath")) {
      tools.push({ tool: "show_mistake", args: { mistake_id: "tenosynovitis-cellulitis" } })
    } else if (q.includes("scaphoid") || q.includes("snuffbox") || q.includes("sprain")) {
      tools.push({ tool: "show_mistake", args: { mistake_id: "scaphoid-normal-xray" } })
    }
  }

  // Always add follow-up chips
  tools.push({ tool: "suggest_followups", args: { chips: buildFollowupChips(q, tools) } })

  return tools
}

function extractTopic(q: string): string {
  if (q.includes("flexor tendon") || q.includes("zone")) return "flexor tendon zones"
  if (q.includes("kanavel") || q.includes("tenosynovitis")) return "Kanavel signs and pyogenic tenosynovitis"
  if (q.includes("mallet")) return "mallet finger"
  if (q.includes("fight bite") || q.includes("mcp")) return "fight bite and MCP joint injuries"
  if (q.includes("scaphoid")) return "scaphoid fractures"
  if (q.includes("distal radius") || q.includes("wrist")) return "distal radius fractures"
  if (q.includes("extensor")) return "extensor tendon anatomy and zones"
  return "hand surgery"
}

function buildFollowupChips(q: string, usedTools: MockToolCall[]): string[] {
  const chips: string[] = []
  const hasCase = usedTools.some((t) => t.tool === "launch_case")
  const hasQuiz = usedTools.some((t) => t.tool === "start_quiz")

  if (!hasCase) chips.push("Walk me through a case")
  if (!hasQuiz) chips.push("Quiz me on this")
  chips.push("Show common mistakes")

  if (q.includes("flexor") || q.includes("zone")) chips.push("What's the worst prognosis zone and why?")
  else if (q.includes("mallet")) chips.push("What happens if untreated?")
  else if (q.includes("fight bite")) chips.push("What bug can I not miss?")
  else chips.push("What changes management?")
  if (q.includes("conference") || q.includes("grant") || q.includes("funding") || q.includes("deadline")) {
    chips.splice(0, chips.length, "Browse Opportunity Hub", "Show deadlines soon", "Show funding opportunities", "Compare saved opportunities")
  }

  return chips.slice(0, 4)
}

async function executeToolMock(toolCall: MockToolCall): Promise<unknown> {
  switch (toolCall.tool) {
    case "launch_case": {
      const c = CASE_MAP[toolCall.args.case_id]
      if (!c) return null
      return { id: c.id, title: c.title, stem: c.stem, difficulty: c.difficulty, estimatedMinutes: c.estimatedMinutes, tags: c.tags, reason: toolCall.args.reason }
    }
    case "show_pearl":
      return PEARLS.find((p) => p.id === toolCall.args.pearl_id) ?? null
    case "show_mistake":
      return MISTAKE_MUSEUM.find((m) => m.id === toolCall.args.mistake_id) ?? null
    case "show_donotmiss":
      return DO_NOT_MISS.find((d) => d.id === toolCall.args.donotmiss_id) ?? null
    case "start_quiz":
    case "suggest_followups":
      return toolCall.args
    case "show_opportunity_list":
      return OPPORTUNITIES.filter((o) => !toolCall.args.query || `${o.title} ${o.description} ${o.tags.join(" ")}`.toLowerCase().includes(toolCall.args.query.toLowerCase())).slice(0, toolCall.args.maxResults)
    case "show_deadline_list":
      return getUpcomingDeadlines(OPPORTUNITIES, toolCall.args.days).slice(0, toolCall.args.maxResults)
    case "show_opportunity_bundle": {
      const b = OPPORTUNITY_BUNDLES.find((x) => x.id === toolCall.args.bundle_id)
      return { bundle: b ?? null, opportunities: OPPORTUNITIES.filter((o) => b?.recommendedOpportunityIds.includes(o.id)) }
    }
    default:
      return null
  }
}

function getMockTextResponse(userMessage: string): string {
  const match = findTutorAnswer(userMessage)
  if (match) {
    return `${match.shortExplanation}\n\n**Rounds one-liner:** ${match.roundsOneLiner}\n\n**Common mistake:** ${match.commonMistake}\n\n**Likely follow-up:** *"${match.likelyFollowUp}"*`
  }
  return (
    "That's a great hand surgery question. In this demo mode, I'm using local keyword matching. " +
    "For a full AI-powered response, set LLM_PROVIDER=anthropic and ANTHROPIC_API_KEY in your .env.local. " +
    "Try asking about fight bites, mallet finger, flexor tendon zones, Kanavel signs, or distal radius fractures."
  )
}

export function createMockUIMessageStreamResponse(userMessage: string) {
  const textResponse = getMockTextResponse(userMessage)
  const toolCalls = detectMockTools(userMessage)
  const chunkSize = 20

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      // Stream text response
      const textId = generateId()
      writer.write({ type: "text-start", id: textId })
      for (let i = 0; i < textResponse.length; i += chunkSize) {
        writer.write({ type: "text-delta", id: textId, delta: textResponse.slice(i, i + chunkSize) })
        await new Promise((r) => setTimeout(r, 25))
      }
      writer.write({ type: "text-end", id: textId })

      // Write tool calls
      for (const toolCall of toolCalls) {
        const toolCallId = generateId()
        const result = await executeToolMock(toolCall)
        if (result === null) continue

        writer.write({
          type: "tool-input-available",
          toolCallId,
          toolName: toolCall.tool,
          input: toolCall.args,
          providerExecuted: true,
        })

        writer.write({
          type: "tool-output-available",
          toolCallId,
          output: result,
        })
      }
    },
  })

  return createUIMessageStreamResponse({ stream })
}
