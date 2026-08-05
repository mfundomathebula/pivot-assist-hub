import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Copy, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import lumenLogo from "@/assets/lumen-logo.png";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AiDisclaimer } from "@/components/shared/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { messageText } from "@/lib/threads";

const transport = new DefaultChatTransport({ api: "/api/chat" });

const starters = [
  "Summarise this week's priorities into three focus areas",
  "Draft a polite nudge for an overdue invoice",
  "Help me structure a 30-minute team retro",
  "Turn these notes into a clear action list",
];

export function ChatWindow({
  threadId,
  initialMessages,
  onMessagesChange,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  onMessagesChange: (threadId: string, messages: UIMessage[]) => void;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, regenerate } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (error) => {
      const message = error.message.includes("429")
        ? "Too many requests right now — try again in a moment."
        : error.message.includes("402")
          ? "AI credits are exhausted. Add credits to keep chatting."
          : "Lumen couldn't respond. Please try again.";
      toast.error(message);
    },
  });

  const isBusy = status === "submitted" || status === "streaming";

  const focusInput = useCallback(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [threadId, focusInput]);

  useEffect(() => {
    if (!isBusy) focusInput();
  }, [isBusy, focusInput]);

  useEffect(() => {
    if (messages.length === 0) return;
    onMessagesChange(threadId, messages);
  }, [messages, threadId, onMessagesChange]);

  const submit = async (text: string) => {
    const value = text.trim();
    if (!value || isBusy) return;
    setInput("");
    await sendMessage({ text: value });
    focusInput();
  };

  const isEmpty = messages.length === 0;
  const lastRole = useMemo(() => messages.at(-1)?.role, [messages]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-1 pb-4">
          {isEmpty ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
              <img
                src={lumenLogo}
                alt="Lumen assistant"
                className="size-14 rounded-2xl shadow-soft"
              />
              <h2 className="mt-4 text-xl font-semibold tracking-tight">How can I help today?</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Ask about writing, planning or prioritising. Lumen keeps this conversation in your
                browser.
              </p>
              <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => void submit(starter)}
                    className="rounded-xl border border-border p-3 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent
                  className={
                    message.role === "assistant"
                      ? "bg-transparent p-0 text-foreground"
                      : undefined
                  }
                >
                  {message.parts.map((part, i) =>
                    part.type === "text" ? (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    ) : null,
                  )}
                </MessageContent>
                {message.role === "assistant" && !isBusy && (
                  <MessageActions>
                    <MessageAction
                      label="Copy"
                      onClick={() => {
                        void navigator.clipboard.writeText(messageText(message));
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Copy className="size-3.5" />
                    </MessageAction>
                    <MessageAction label="Regenerate" onClick={() => void regenerate()}>
                      <RefreshCw className="size-3.5" />
                    </MessageAction>
                  </MessageActions>
                )}
              </Message>
            ))
          )}

          {status === "submitted" && lastRole === "user" && (
            <div className="px-1 py-2">
              <Shimmer>Thinking…</Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl pt-2">
        <PromptInput
          className="rounded-2xl shadow-soft"
          onSubmit={(_message, event) => {
            event.preventDefault();
            void submit(input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Lumen anything…"
            autoFocus
          />
          <PromptInputFooter className="justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-lg text-xs text-muted-foreground"
              onClick={() => setInput("")}
              disabled={!input}
            >
              Clear
            </Button>
            <PromptInputSubmit status={status} disabled={!input.trim() && !isBusy} />
          </PromptInputFooter>
        </PromptInput>
        <div className="mt-2">
          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}
