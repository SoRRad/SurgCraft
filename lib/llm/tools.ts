// Vercel AI SDK v6 tool definitions for the SurgiCraft : Handcraft tutor.
// All tools have server-side execute functions that return structured data.
// The client renders rich UI based on the tool name and result.

import { tool } from "ai"
import { z } from "zod"
import { MISTAKE_MUSEUM, DO_NOT_MISS, PEARLS, PEARL_IDS } from "@/lib/demo/demo-content"

import case001 from "@/content/cases/001-fight-bite.json"
import case002 from "@/content/cases/002-mallet-finger.json"
import case003 from "@/content/cases/003-distal-radius.json"

const CASE_MAP: Record<string, { id: string; title: string; stem: string; difficulty: string; estimatedMinutes: number; tags: string[] }> = {
  "001-fight-bite": case001,
  "002-mallet-finger": case002,
  "003-distal-radius": case003,
}

export const ShowPearlInputSchema = z
  .object({
    pearl_id: z.enum(PEARL_IDS).describe("ID of the known local pearl to surface"),
  })
  .strict()

export const allTools = {
  launch_case: tool({
    description:
      "Use when the user asks to walk through, work through, or be guided through a specific clinical case. " +
      "Available cases: " +
      "001-fight-bite (fight bite, clenched-fist injury, dorsal MCP wound, Eikenella), " +
      "002-mallet-finger (mallet finger, DIP extensor tendon avulsion, splinting, swan-neck), " +
      "003-distal-radius (FOOSH, distal radius fracture, median nerve, carpal tunnel, DRUJ). " +
      "Match the user's intent to the best case_id. Always include a brief reason.",
    inputSchema: z.object({
      case_id: z
        .enum(["001-fight-bite", "002-mallet-finger", "003-distal-radius"])
        .describe("The ID of the case to launch"),
      reason: z
        .string()
        .describe("One sentence explaining why this case matches the user's question"),
    }),
    execute: async ({ case_id, reason }) => {
      const c = CASE_MAP[case_id]
      if (!c) return null
      return {
        id: c.id,
        title: c.title,
        stem: c.stem,
        difficulty: c.difficulty,
        estimatedMinutes: c.estimatedMinutes,
        tags: c.tags,
        reason,
      }
    },
  }),

  show_pearl: tool({
    description:
      "Use when one known local demo pearl perfectly captures the teaching point. " +
      "Use sparingly — at most one per response. Never fabricate pearl text or attribution. " +
      "Available pearl IDs: fight-bite-mcp, eikenella, mallet-flex-resets-clock, " +
      "mallet-leave-pip, acute-cts-distal-radius, distal-radius-not-just-a-wrist-fracture.",
    inputSchema: ShowPearlInputSchema,
    execute: async ({ pearl_id }) => PEARLS.find((p) => p.id === pearl_id) ?? null,
  }),

  show_mistake: tool({
    description:
      "Surface a common mistake card when the current topic is one where learners frequently err. " +
      "Available mistake IDs: fight-bite-closed, pip-splinted, median-nerve-watched, " +
      "tenosynovitis-cellulitis, cascade-not-checked, scaphoid-normal-xray.",
    inputSchema: z.object({
      mistake_id: z
        .enum([
          "fight-bite-closed",
          "pip-splinted",
          "median-nerve-watched",
          "tenosynovitis-cellulitis",
          "cascade-not-checked",
          "scaphoid-normal-xray",
        ])
        .describe("ID of the mistake entry to surface"),
    }),
    execute: async ({ mistake_id }) =>
      MISTAKE_MUSEUM.find((m) => m.id === mistake_id) ?? null,
  }),

  show_donotmiss: tool({
    description:
      "Surface a do-not-miss red flag card when discussing a high-stakes diagnosis. " +
      "Always accompany with the implicit safety reminder that in real clinical care, escalation is non-negotiable. " +
      "Available IDs: fight-bite-joint, acute-cts-distal-radius, pyogenic-tenosynovitis, " +
      "compartment-syndrome, scaphoid-occult, dysvascular-digit, open-fracture, tendon-laceration-abnormal-cascade.",
    inputSchema: z.object({
      donotmiss_id: z
        .enum([
          "fight-bite-joint",
          "acute-cts-distal-radius",
          "pyogenic-tenosynovitis",
          "compartment-syndrome",
          "scaphoid-occult",
          "dysvascular-digit",
          "open-fracture",
          "tendon-laceration-abnormal-cascade",
        ])
        .describe("ID of the do-not-miss entry to surface"),
    }),
    execute: async ({ donotmiss_id }) =>
      DO_NOT_MISS.find((d) => d.id === donotmiss_id) ?? null,
  }),

  start_quiz: tool({
    description:
      "Enter quiz mode on a topic when the user explicitly asks to be quizzed, drilled, or tested, " +
      "or when you sense they would benefit from testing comprehension on a topic just discussed. " +
      "Quiz should be 5 questions with grading and one-sentence explanations after each answer.",
    inputSchema: z.object({
      topic: z
        .string()
        .describe('The topic to quiz on, e.g. "flexor tendon zones" or "Kanavel signs"'),
      intensity: z
        .enum(["gentle", "standard", "pyrotechnic"])
        .describe(
          "gentle = more hints and encouragement; standard = balanced; pyrotechnic = attending-voice rapid-fire"
        ),
    }),
    execute: async (input) => input,
  }),

  suggest_followups: tool({
    description:
      "Call at the end of nearly every response to offer 2–4 follow-up paths the user can take. " +
      "Make chips specific to what was just discussed. " +
      'Examples: "Quiz me on this", "Show the common mistake", "Walk me through a case", ' +
      '"What changes management?", "Tell me about the anatomy", "What\'s the do-not-miss here?"',
    inputSchema: z.object({
      chips: z
        .array(z.string())
        .min(2)
        .max(4)
        .describe("2–4 short follow-up prompts the user can tap"),
    }),
    execute: async (input) => input,
  }),
}

export type ToolName = keyof typeof allTools
