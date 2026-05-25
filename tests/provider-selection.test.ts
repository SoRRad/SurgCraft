import { afterEach, describe, expect, it } from "vitest"
import { resolveLLMProvider } from "@/lib/llm/provider-selection"

const ORIGINAL_ENV = { ...process.env }

function resetEnv() {
  process.env = { ...ORIGINAL_ENV }
  delete process.env.LLM_PROVIDER
  delete process.env.NEXT_PUBLIC_APP_MODE
  delete process.env.ANTHROPIC_API_KEY
}

afterEach(resetEnv)

describe("resolveLLMProvider", () => {
  it("returns mock by default", () => {
    resetEnv()

    expect(resolveLLMProvider()).toMatchObject({
      provider: "mock",
      requestedProvider: null,
      mode: "demo",
      reason: null,
    })
  })

  it("falls back to mock when Anthropic is requested without a key", () => {
    resetEnv()
    process.env.LLM_PROVIDER = "anthropic"

    const selection = resolveLLMProvider()

    expect(selection.provider).toBe("mock")
    expect(selection.requestedProvider).toBe("anthropic")
    expect(selection.mode).toBe("demo")
    expect(selection.reason).toContain("ANTHROPIC_API_KEY")
  })

  it("returns anthropic when requested and keyed", () => {
    resetEnv()
    process.env.LLM_PROVIDER = "anthropic"
    process.env.ANTHROPIC_API_KEY = "test-key"

    expect(resolveLLMProvider()).toMatchObject({
      provider: "anthropic",
      requestedProvider: "anthropic",
      mode: "live",
      reason: null,
    })
  })
})
