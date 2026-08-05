import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ChatWindow } from "@/components/assistant/chat-window";
import { Button } from "@/components/ui/button";
import {
  createThreadId,
  deriveTitle,
  emptyThread,
  loadThreads,
  persistThreads,
  upsertThread,
  type ChatThread,
} from "@/lib/threads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant/$threadId")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Lumen AI" },
      {
        name: "description",
        content: "Chat with Lumen about writing, planning and prioritising your work.",
      },
      { property: "og:title", content: "AI Assistant — Lumen AI" },
      { property: "og:description", content: "Threaded AI chat saved in your browser." },
    ],
  }),
  component: AssistantThread,
});

function AssistantThread() {
  const { threadId } = useParams({ from: "/assistant/$threadId" });
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadThreads();
    const existing = stored.find((t) => t.id === threadId);
    const next = existing ? stored : upsertThread(stored, emptyThread(threadId));
    if (!existing) persistThreads(next);
    setThreads(next);
    setReady(true);
  }, [threadId]);

  const handleMessages = useCallback(
    (id: string, messages: UIMessage[]) => {
      setThreads((prev) => {
        const current = prev.find((t) => t.id === id) ?? emptyThread(id);
        const updated: ChatThread = {
          ...current,
          messages,
          title: current.title === "New conversation" ? (deriveTitle(messages) ?? current.title) : current.title,
          updatedAt: Date.now(),
        };
        const next = upsertThread(prev, updated);
        persistThreads(next);
        return next;
      });
    },
    [],
  );

  const newThread = () => {
    const thread = emptyThread(createThreadId());
    const next = upsertThread(threads, thread);
    persistThreads(next);
    setThreads(next);
    void navigate({ to: "/assistant/$threadId", params: { threadId: thread.id } });
  };

  const deleteThread = (id: string) => {
    const next = threads.filter((t) => t.id !== id);
    persistThreads(next);
    setThreads(next);
    if (id === threadId) {
      const target = next[0];
      if (target) {
        void navigate({ to: "/assistant/$threadId", params: { threadId: target.id } });
      } else {
        void navigate({ to: "/assistant" });
      }
    }
  };

  const active = threads.find((t) => t.id === threadId);

  return (
    <div className="mx-auto grid h-[calc(100vh-8rem)] max-w-7xl gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
      <aside className="panel hidden min-h-0 flex-col p-3 lg:flex">
        <Button onClick={newThread} className="rounded-xl">
          <Plus className="mr-1.5 size-4" />
          New conversation
        </Button>
        <p className="mt-4 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Conversations
        </p>
        <nav className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={cn(
                "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl px-2 py-2 transition-colors",
                thread.id === threadId ? "bg-primary-soft" : "hover:bg-accent/60",
              )}
            >
              <MessageSquare
                className={cn(
                  "size-4 shrink-0",
                  thread.id === threadId ? "text-primary" : "text-muted-foreground",
                )}
              />
              <button
                type="button"
                onClick={() =>
                  void navigate({ to: "/assistant/$threadId", params: { threadId: thread.id } })
                }
                className="min-w-0 truncate text-left text-sm"
              >
                {thread.title}
              </button>
              <button
                type="button"
                aria-label={`Delete ${thread.title}`}
                onClick={() => deleteThread(thread.id)}
                className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </nav>
      </aside>

      <section className="panel flex min-h-0 flex-col p-4 sm:p-5">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h1 className="min-w-0 truncate text-base font-semibold">
            {active?.title ?? "New conversation"}
          </h1>
          <Button variant="outline" size="sm" onClick={newThread} className="rounded-xl lg:hidden">
            <Plus className="mr-1 size-3.5" />
            New
          </Button>
        </div>
        {ready && (
          <ChatWindow
            key={threadId}
            threadId={threadId}
            initialMessages={active?.messages ?? []}
            onMessagesChange={handleMessages}
          />
        )}
      </section>
    </div>
  );
}
