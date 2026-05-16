// Per-session cost tracking for the Anthropic provider.
// Uses claude-sonnet-4-5 pricing: ~$3/M input, ~$15/M output.
// Phase 0C will move this to the database.

const INPUT_COST_PER_TOKEN = 3 / 1_000_000
const OUTPUT_COST_PER_TOKEN = 15 / 1_000_000

const sessionUsage = new Map<string, { inputTokens: number; outputTokens: number }>()

export function estimateCost(usage: { inputTokens: number; outputTokens: number }): number {
  return usage.inputTokens * INPUT_COST_PER_TOKEN + usage.outputTokens * OUTPUT_COST_PER_TOKEN
}

export function recordUsage(sessionId: string, inputTokens: number, outputTokens: number): void {
  const current = sessionUsage.get(sessionId) ?? { inputTokens: 0, outputTokens: 0 }
  sessionUsage.set(sessionId, {
    inputTokens: current.inputTokens + inputTokens,
    outputTokens: current.outputTokens + outputTokens,
  })
}

export function checkSessionLimit(sessionId: string): boolean {
  const maxCost = parseFloat(process.env.MAX_COST_PER_SESSION_USD ?? "0.50")
  const usage = sessionUsage.get(sessionId) ?? { inputTokens: 0, outputTokens: 0 }
  const spent = estimateCost(usage)
  return spent < maxCost
}

export function getSessionCost(sessionId: string): number {
  const usage = sessionUsage.get(sessionId) ?? { inputTokens: 0, outputTokens: 0 }
  return estimateCost(usage)
}
