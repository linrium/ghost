import { type InferAgentUIMessage, ToolLoopAgent } from "ai"
import { ollama } from "ollama-ai-provider-v2"
import { fetchWebPageTool } from "@/lib/tools/fetch-web-page-tool"

export const chatAgent = new ToolLoopAgent({
  model: ollama("gemma4:e4b"),
  providerOptions: { ollama: { think: true } },
  instructions: `You are a helpful assistant.
When the user asks about a website or provides a URL, use the fetchWebPage tool to retrieve its content, then provide a clear and concise summary of what you found.`,
  tools: {
    fetchWebPage: fetchWebPageTool,
  },
})

export type ChatAgentUIMessage = InferAgentUIMessage<typeof chatAgent>
