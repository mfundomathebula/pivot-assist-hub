import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Server-only provider for Lovable AI Gateway.
 */
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export const CHAT_MODEL = "google/gemini-3.6-flash";

export function requireGatewayKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return key;
}
