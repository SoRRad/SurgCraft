import { resolveLLMProvider } from "@/lib/llm/provider-selection"

export const dynamic = "force-dynamic"

export function GET() {
  const selection = resolveLLMProvider()

  return Response.json({
    provider: selection.provider,
    requestedProvider: selection.requestedProvider,
    mode: selection.mode,
    reason: selection.reason,
    hasAnthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
  })
}
