import { describe, expect, it } from "vitest"
import { PEARL_IDS, PEARLS } from "@/lib/demo/demo-content"
import { ShowPearlInputSchema } from "@/lib/llm/tools"

describe("show_pearl tool safety", () => {
  it("does not accept arbitrary pearl text", () => {
    expect(
      ShowPearlInputSchema.safeParse({
        pearl_id: "fight-bite-mcp",
        pearl_text: "Trust me, this is a pearl.",
        attribution: "Made up",
      }).success
    ).toBe(false)
  })

  it("accepts only known pearl IDs", () => {
    for (const pearlId of PEARL_IDS) {
      expect(ShowPearlInputSchema.safeParse({ pearl_id: pearlId }).success).toBe(true)
    }

    expect(ShowPearlInputSchema.safeParse({ pearl_id: "unknown-pearl" }).success).toBe(false)
  })

  it("registry contains complete authored pearl records", () => {
    for (const pearl of PEARLS) {
      expect(pearl).toMatchObject({
        id: expect.any(String),
        topic: expect.any(String),
        text: expect.any(String),
        attribution: expect.any(String),
        sourceLabel: expect.any(String),
        verified: expect.any(Boolean),
      })
    }
  })
})
