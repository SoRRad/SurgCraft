import { generateText } from "ai"
import { getStreamingProviderConfig } from "@/lib/llm/streaming-provider"

function mockTitle(firstUserMessage: string): string {
  const words = firstUserMessage.trim().split(/\s+/).slice(0, 5)
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
}

export async function POST(req: Request) {
  const { firstUserMessage } = await req.json()
  if (!firstUserMessage) {
    return Response.json({ title: "New conversation" })
  }

  const providerConfig = getStreamingProviderConfig()

  if (providerConfig.mode === "anthropic") {
    try {
      const { text } = await generateText({
        model: providerConfig.model,
        prompt: `Summarize this medical learning question into a 4-7 word title. Respond with only the title. No quotes, no period.\n\nQuestion: ${firstUserMessage}`,
        maxOutputTokens: 20,
      })
      return Response.json({ title: text.trim() })
    } catch {
      return Response.json({ title: mockTitle(firstUserMessage) })
    }
  }

  return Response.json({ title: mockTitle(firstUserMessage) })
}

