"use client"

import { useChat } from "@ai-sdk/react"
import {
  IconBrain,
  IconChevronDown,
  IconMessageCircle,
  IconSend,
  IconWorld,
  IconWorldCheck,
  IconWorldX,
} from "@tabler/icons-react"
import { useForm } from "@tanstack/react-form"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { ChatAgentUIMessage } from "@/lib/agents/chat-agent"
import type { FetchWebPageInvocation } from "@/lib/tools/fetch-web-page-tool"
import { cn } from "@/lib/utils"

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current" />
    </div>
  )
}

function FetchWebPageToolCall({ part }: { part: FetchWebPageInvocation }) {
  const isStreaming = part.state === "input-streaming"
  const isPending =
    part.state === "input-streaming" || part.state === "input-available"
  const isError = part.state === "output-error"
  const isDone = part.state === "output-available"

  function getLabel() {
    if (isStreaming) {
      return <ThinkingDots />
    }
    if (isPending) {
      return (
        <span className="flex items-center gap-2">
          {`Fetching ${part.input?.url ?? "…"}`}
          <ThinkingDots />
        </span>
      )
    }
    if (isError) {
      return "Fetch failed"
    }
    return `Fetched ${part.input?.url}`
  }

  function getIcon() {
    if (isError) {
      return <IconWorldX className="shrink-0 text-destructive" />
    }
    if (isPending) {
      return <IconWorld className="shrink-0 animate-pulse" />
    }
    return <IconWorldCheck className="shrink-0 text-green-600" />
  }

  return (
    <Collapsible disabled={!isDone}>
      <CollapsibleTrigger className="flex max-w-[75%] items-center gap-2 rounded-xl border bg-background px-3 py-2 text-muted-foreground text-xs transition-colors hover:bg-muted/50 disabled:pointer-events-none">
        {getIcon()}
        <span className="font-medium text-foreground">{getLabel()}</span>
        {isDone && (
          <IconChevronDown className="ml-1 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 max-w-[75%]">
        {isDone && (
          <div className="whitespace-pre-wrap rounded-xl border bg-muted/40 px-3 py-2 text-muted-foreground text-xs leading-relaxed">
            {part.output.content}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function MessagePart({
  part,
  role,
}: {
  part: ChatAgentUIMessage["parts"][number]
  role: ChatAgentUIMessage["role"]
}) {
  if (part.type === "text") {
    if (!part.text.trim()) {
      return null
    }
    return (
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <span className="whitespace-pre-wrap">{part.text}</span>
      </div>
    )
  }

  if (part.type === "reasoning") {
    if (!part.text.trim()) {
      return null
    }
    return (
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted/50">
          <IconBrain className="size-3.5 shrink-0" />
          <span>Thinking</span>
          <IconChevronDown className="size-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 max-w-[75%]">
          <div className="whitespace-pre-wrap rounded-xl border bg-muted/40 px-3 py-2 text-muted-foreground text-xs italic leading-relaxed">
            {part.text}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  if (part.type === "tool-fetchWebPage") {
    return <FetchWebPageToolCall part={part} />
  }

  return null
}

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat<ChatAgentUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const form = useForm({
    defaultValues: { message: "" },
    onSubmit: ({ value, formApi }) => {
      if (!value.message.trim()) {
        return
      }
      sendMessage({ text: value.message })
      formApi.reset()
    },
  })

  const isAgentRunning = status === "submitted" || status === "streaming"

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Conversations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="New chat">
                    <IconMessageCircle />
                    <span>New chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
          <span className="font-medium text-sm">Gemma Chat</span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
            {messages.length === 0 && (
              <p className="mt-8 text-center text-muted-foreground">
                Start a conversation with Gemma
              </p>
            )}
            {messages.map((message, messageIndex) => {
              const isLastMessage = messageIndex === messages.length - 1
              const hasVisibleText = message.parts.some(
                (p) => p.type === "text" && p.text.trim()
              )
              const showLoadingBubble =
                isLastMessage &&
                isAgentRunning &&
                message.role === "assistant" &&
                !hasVisibleText

              const reasoningParts = message.parts.filter(
                (p) => p.type === "reasoning"
              )
              const otherParts = message.parts.filter(
                (p) => p.type !== "reasoning"
              )
              const orderedParts = [...reasoningParts, ...otherParts]

              return (
                <div
                  className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}
                  key={message.id}
                >
                  {orderedParts.map((part, i) => (
                    <MessagePart
                      key={
                        part.type === "tool-fetchWebPage"
                          ? part.toolCallId
                          : `${message.id}-${i}`
                      }
                      part={part}
                      role={message.role}
                    />
                  ))}
                  {showLoadingBubble && (
                    <div className="rounded-2xl bg-muted px-4 py-2 text-muted-foreground text-sm">
                      <ThinkingDots />
                    </div>
                  )}
                </div>
              )
            })}
            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-2 text-muted-foreground text-sm">
                  <ThinkingDots />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 shrink-0 border-t bg-background">
          <form
            className="mx-auto flex w-full max-w-2xl gap-2 p-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <form.Field name="message">
              {(field) => (
                <Input
                  className="flex-1"
                  disabled={status !== "ready"}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Message Gemma…"
                  value={field.state.value}
                />
              )}
            </form.Field>
            <form.Subscribe selector={(state) => state.values.message}>
              {(message) => (
                <Button
                  disabled={status !== "ready" || !message.trim()}
                  type="submit"
                >
                  <IconSend data-icon="inline-start" />
                  Send
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
