import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { ollama } from "ollama-ai-provider-v2"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: ollama("gemma4:e4b"),
    system: "You are a helpful assistant.",
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
