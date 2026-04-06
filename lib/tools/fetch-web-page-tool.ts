import { tool, type UIToolInvocation } from "ai"
import { z } from "zod"

export const fetchWebPageTool = tool({
  description:
    "Fetch the text content of a web page at a given URL. Use this when the user asks about a website or provides a URL.",
  inputSchema: z.object({
    url: z.string().url().describe("The URL of the web page to fetch."),
  }),
  execute: async ({ url }) => {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GhostBot/1.0)" },
    })
    const html = await response.text()
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000)
    return { url, content: text }
  },
})

export type FetchWebPageInvocation = UIToolInvocation<typeof fetchWebPageTool>
