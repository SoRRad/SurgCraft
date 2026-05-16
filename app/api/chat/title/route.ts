import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

function mockTitle(firstUserMessage: string): string {
  const words = firstUserMessage.trim().split(/\s+/).slice(0, 5)
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
}

export async function POST(req: Request) {
  const { firstUserMessage } = await req.json()
  if (!firstUserMessage) {
    return Response.json({ title: "New conversation" })
  }

  const mode = process.env.NEXT_PUBLIC_APP_MODE
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (mode === "live" && apiKey) {
    try {
      const { text } = await generateText({
        model: anthropic("claude-sonnet-4-5"),
        prompt: `Summarize this medical learning question into a 4–7 word title. Respond with only the title. No quotes, no period.\n\nQuestion: ${firstUserMessage}`,
        maxOutputTokens: 20,
      })
      return Response.json({ title: text.trim() })
    } catch {
      return Response.json({ title: mockTitle(firstUserMessage) })
    }
  }

  return Response.json({ title: mockTitle(firstUserMessage) })
}
