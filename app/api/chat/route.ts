import { createAgentUIStreamResponse, type UIMessage } from "ai"
import { chatAgent } from "@/lib/agents/chat-agent"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  return createAgentUIStreamResponse({
    agent: chatAgent,
    uiMessages: messages,
  })
}
