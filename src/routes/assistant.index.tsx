import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { createThreadId, emptyThread, loadThreads, persistThreads } from "@/lib/threads";

export const Route = createFileRoute("/assistant/")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Lumen AI" },
      {
        name: "description",
        content: "Chat with Lumen, your AI productivity assistant. Conversations stay in your browser.",
      },
      { property: "og:title", content: "AI Assistant — Lumen AI" },
      { property: "og:description", content: "A calm AI chat for writing, planning and prioritising." },
    ],
  }),
  component: AssistantIndex,
});

function AssistantIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    const threads = loadThreads();
    const target = threads[0];
    if (target) {
      void navigate({ to: "/assistant/$threadId", params: { threadId: target.id }, replace: true });
      return;
    }
    const thread = emptyThread(createThreadId());
    persistThreads([thread]);
    void navigate({ to: "/assistant/$threadId", params: { threadId: thread.id }, replace: true });
  }, [navigate]);

  return (
    <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">
      Opening your assistant…
    </div>
  );
}
