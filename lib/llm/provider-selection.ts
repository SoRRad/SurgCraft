export type LLMProviderId = "mock" | "anthropic"

export type ProviderSelection = {
  provider: LLMProviderId
  requestedProvider: string
  mode: "demo" | "live"
  reason?: string
}

function normalize(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? ""
}

function providerFromEnv(): { provider: LLMProviderId; requestedProvider: string; reason?: string } {
  const explicitProvider = normalize(process.env.LLM_PROVIDER)
  const appMode = normalize(process.env.NEXT_PUBLIC_APP_MODE)

  if (explicitProvider) {
    if (explicitProvider === "mock" || explicitProvider === "demo" || explicitProvider === "local") {
      return { provider: "mock", requestedProvider: explicitProvider }
    }

    if (explicitProvider === "anthropic" || explicitProvider === "claude") {
      return { provider: "anthropic", requestedProvider: explicitProvider }
    }

    return {
      provider: "mock",
      requestedProvider: explicitProvider,
      reason: `Unknown LLM_PROVIDER="${explicitProvider}". Falling back to mock provider.`,
    }
  }

  if (appMode === "live") {
    return { provider: "anthropic", requestedProvider: "NEXT_PUBLIC_APP_MODE=live" }
  }

  return { provider: "mock", requestedProvider: appMode || "default" }
}

export function resolveLLMProvider(): ProviderSelection {
  const selection = providerFromEnv()

  if (selection.provider === "anthropic" && !process.env.ANTHROPIC_API_KEY) {
    return {
      provider: "mock",
      requestedProvider: selection.requestedProvider,
      mode: "demo",
      reason: "Anthropic provider requested but ANTHROPIC_API_KEY is not set. Falling back to mock provider.",
    }
  }

  return {
    ...selection,
    mode: selection.provider === "anthropic" ? "live" : "demo",
  }
}

export function logProviderFallback(selection: ProviderSelection): void {
  if (!selection.reason) return
  console.warn(`[surgicraft] ${selection.reason}`)
}
