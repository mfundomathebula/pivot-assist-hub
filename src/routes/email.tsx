import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Maximize2, Minimize2, PenLine, Sparkle, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { OutputPanel } from "@/components/shared/output-panel";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "AI Email Generator — Lumen AI" },
      {
        name: "description",
        content:
          "Draft, improve, rewrite, shorten or expand professional emails in seconds with tone control and full context.",
      },
      { property: "og:title", content: "AI Email Generator — Lumen AI" },
      {
        property: "og:description",
        content: "Describe the email you need and let Lumen write it in your tone.",
      },
    ],
  }),
  component: EmailGenerator;
});

const tones = [
  "Professional",
  "Friendly",
  "Warm",
  "Concise",
  "Persuasive",
  "Apologetic",
  "Enthusiastic",
  "Formal",
];

type Action = "generate" | "improve" | "rewrite" | "shorten" | "expand";

function EmailGenerator() {
  const runGenerate = useServerFn(generateEmail);

  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Professional");
  const [context, setContext] = useState("");
  const [instructions, setInstructions] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: Action) => {
    if (purpose.trim().length < 3) {
      setError("Tell Lumen what the email is for — at least a few words.");
      return;
    }
    if (action !== "generate" && !email.trim()) {
      toast.error("Generate an email first, then refine it.");
      return;
    }
    setError(null);
    setLoading(action);
    try {
      const result = await runGenerate({
        data: {
          purpose,
          recipient,
          tone,
          context,
          instructions,
          action,
          draft: action === "generate" ? "" : email,
        },
      });
      setEmail(result.email.trim());
      toast.success(action === "generate" ? "Email drafted" : `Email ${action}d`);
    } catch {
      toast.error("Lumen couldn't finish that request. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const refineActions: { action: Action; label: string; icon: typeof Wand2 }[] = [
    { action: "improve", label: "Improve", icon: Wand2 },
    { action: "rewrite", label: "Rewrite", icon: PenLine },
    { action: "shorten", label: "Shorten", icon: Minimize2 },
    { action: "expand", label: "Expand", icon: Maximize2 },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        eyebrow="Smart email generator"
        title="Write the email, not the first draft"
        description="Give Lumen the purpose and context. It handles the phrasing, tone and structure."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form
          className="panel flex flex-col gap-5 p-5 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            void run("generate");
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Follow up on the pricing proposal"
              maxLength={300}
              aria-invalid={Boolean(error)}
              aria-describedby="purpose-hint"
              className="rounded-xl"
            />
            <p id="purpose-hint" className="text-xs text-muted-foreground">
              One line is enough — “ask for a deadline extension”.
            </p>
            {error && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Priya, Head of Ops"
                maxLength={160}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Context</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="We sent the proposal on Monday. They asked for volume pricing."
              maxLength={4000}
              className="min-h-28 resize-none rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Paste the thread, notes or bullet points — Lumen keeps the facts.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Additional instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Keep it under 120 words. Offer two meeting slots."
              maxLength={2000}
              className="min-h-20 resize-none rounded-xl"
            />
          </div>

          <Button type="submit" disabled={loading !== null} className="rounded-xl">
            <Sparkle className="mr-1.5 size-4" />
            {loading === "generate" ? "Generating…" : "Generate email"}
          </Button>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Refine the draft
            </p>
            <div className="flex flex-wrap gap-2">
              {refineActions.map(({ action, label, icon: Icon }) => (
                <Button
                  key={action}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading !== null || !email.trim()}
                  onClick={() => void run(action)}
                  className="rounded-xl"
                >
                  <Icon className="mr-1.5 size-3.5" />
                  {loading === action ? `${label}…` : label}
                </Button>
              ))}
            </div>
          </div>
        </form>

        <OutputPanel
          title="Generated email"
          badge={tone}
          value={email}
          onChange={setEmail}
          loading={loading !== null}
          onRegenerate={() => void run("generate")}
          downloadName="lumen-email.txt"
          emptyState={
            <div className="max-w-xs text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
                <Mail className="size-5" />
              </span>
              <p className="mt-3 text-sm font-medium">No email yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Fill in the purpose on the left and hit Generate. Your draft appears here, ready to
                copy, edit or download.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
