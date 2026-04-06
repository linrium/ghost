"use client"

import { useChat } from "@ai-sdk/react"
import { IconMessageCircle, IconSend } from "@tabler/icons-react"
import { useForm } from "@tanstack/react-form"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
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

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Gemma Chat">
                <IconMessageCircle />
                <span className="font-semibold">Gemma Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
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
            {messages.map((message) => (
              <div
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                key={message.id}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {message.parts.map((part) =>
                    part.type === "text" ? (
                      <span className="whitespace-pre-wrap" key={part.text}>
                        {part.text}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            ))}
            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-2 text-muted-foreground text-sm">
                  Thinking…
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
