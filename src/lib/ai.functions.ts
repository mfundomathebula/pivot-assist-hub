import { createServerFn } from "@tanstack/react-start";
import { streamText, streamObject } from "ai";
import { z } from "zod";
import { CHAT_MODEL, createLovableAiGatewayProvider, requireGatewayKey } from "./ai-gateway.server";

const EmailInput = z.object({
  purpose: z.string().trim().min(3).max(300),
  recipient: z.string().trim().max(160).default(""),
  tone: z.string().trim().max(60).default("Professional"),
  context: z.string().trim().max(4000).default(""),
  instructions: z.string().trim().max(2000).default(""),
  action: z
    .enum(["generate", "improve", "rewrite", "shorten", "expand"])
    .default("generate"),
  draft: z.string().trim().max(8000).default(""),
});

const actionPrompt: Record<string, string> = {
  generate: "Write the email from scratch.",
  improve: "Improve the existing draft: sharper wording, better flow, same meaning and length.",
  rewrite: "Rewrite the existing draft with a fresh structure while keeping intent and facts.",
  shorten: "Shorten the existing draft to roughly half its length while keeping every key point.",
  expand: "Expand the existing draft with helpful detail, context and a clear call to action.",
};

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(requireGatewayKey());

    const result = streamText({
      model: gateway(CHAT_MODEL),
      system:
        "You are an expert business email writer. Return only the email: a 'Subject:' line, then a blank line, then the body. No commentary, no markdown fences. Keep it human, specific and free of filler.",
      prompt: [
        actionPrompt[data.action] ?? actionPrompt["generate"],
        `Purpose: ${data.purpose}`,
        data.recipient ? `Recipient: ${data.recipient}` : "",
        `Tone: ${data.tone}`,
        data.context ? `Context:\n${data.context}` : "",
        data.instructions ? `Additional instructions:\n${data.instructions}` : "",
        data.draft ? `Existing draft:\n${data.draft}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    });

    return { email: await result.text };
  });

const PlanInput = z.object({
  goal: z.string().trim().min(3).max(400),
  deadline: z.string().trim().max(60).default(""),
  priority: z.string().trim().max(30).default("Medium"),
  hoursPerDay: z.number().min(0.5).max(16).default(4),
  notes: z.string().trim().max(2000).default(""),
});

const planSchema = z.object({
  summary: z.string(),
  totalEstimatedHours: z.number(),
  dailySchedule: z.array(
    z.object({
      day: z.string(),
      focus: z.string(),
      blocks: z.array(
        z.object({
          time: z.string(),
          task: z.string(),
          minutes: z.number(),
          priority: z.enum(["high", "medium", "low"]),
        }),
      ),
    }),
  ),
  weeklyPlan: z.array(z.object({ week: z.string(), focus: z.string(), goals: z.array(z.string()) })),
  milestones: z.array(z.object({ title: z.string(), due: z.string(), description: z.string() })),
  priorityBreakdown: z.array(z.object({ label: z.string(), percentage: z.number() })),
  recommendations: z.array(z.string()),
});

export type GeneratedPlan = z.infer<typeof planSchema>;

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(requireGatewayKey());

    const result = streamObject({
      model: gateway(CHAT_MODEL),
      schema: planSchema,
      system:
        "You are a meticulous productivity planner. Build realistic, time-boxed plans. Percentages in priorityBreakdown must sum to 100. Provide 3-5 daily schedule days, 1-3 weeks, 3-5 milestones and 3-5 recommendations.",
      prompt: [
        `Goal: ${data.goal}`,
        data.deadline ? `Deadline: ${data.deadline}` : "No hard deadline",
        `Priority: ${data.priority}`,
        `Available hours per day: ${data.hoursPerDay}`,
        data.notes ? `Notes: ${data.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return await result.object;
  });
