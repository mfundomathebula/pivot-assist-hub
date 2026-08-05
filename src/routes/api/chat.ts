import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  CHAT_MODEL,
  createLovableAiGatewayProvider,
  requireGatewayKey,
} from "@/lib/ai-gateway.server";

type ChatRequestBody = { messages?: unknown };

const SYSTEM_PROMPT = `You are Lumen, a calm and highly capable AI productivity assistant.
You help people write better, plan their work, and think clearly.
Be concise and concrete. Use short markdown sections and bullet lists when they add clarity.
Never invent facts about the user's data — ask a brief clarifying question instead.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        let key: string;
        try {
          key = requireGatewayKey();
        } catch {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(CHAT_MODEL),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
