import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CalendarCheck,
  Clock,
  Flag,
  ListChecks,
  Lightbulb,
  Sparkle,
  Target,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/shared/ai-disclaimer";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { generatePlan, type GeneratedPlan } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Lumen AI" },
      {
        name: "description",
        content:
          "Turn any goal into a time-boxed daily schedule, weekly plan and milestone timeline with AI prioritisation.",
      },
      { property: "og:title", content: "AI Task Planner — Lumen AI" },
      {
        property: "og:description",
        content: "Describe a goal and get a realistic plan with schedule, milestones and priorities.",
      },
    ],
  }),
  component: Planner,
});

const priorities = ["Low", "Medium", "High", "Critical"];

function Planner() {
  const runPlan = useServerFn(generatePlan);

  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (goal.trim().length < 3) {
      setError("Describe the goal you want a plan for.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await runPlan({
        data: { goal, deadline, priority, hoursPerDay, notes },
      });
      setPlan(result as GeneratedPlan);
      toast.success("Plan ready");
    } catch {
      toast.error("Lumen couldn't build that plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        eyebrow="AI task planner"
        title="From a fuzzy goal to a real schedule"
        description="Lumen breaks the goal into time-boxed blocks, weekly focus areas and milestones you can actually hit."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <form
          className="panel flex h-fit flex-col gap-5 p-5 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="goal">Goal or project</Label>
            <Textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Launch the new pricing page and supporting campaign"
              maxLength={400}
              aria-invalid={Boolean(error)}
              className="min-h-24 resize-none rounded-xl"
            />
            {error && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="In 2 weeks"
                maxLength={60}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority" className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <Label htmlFor="hours">Focus hours per day</Label>
              <span className="shrink-0 text-sm font-medium text-primary">{hoursPerDay}h</span>
            </div>
            <Slider
              id="hours"
              min={1}
              max={12}
              step={0.5}
              value={[hoursPerDay]}
              onValueChange={([v]) => setHoursPerDay(v ?? 4)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Constraints & notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="No meetings before 11am. Design review needed midweek."
              maxLength={2000}
              className="min-h-20 resize-none rounded-xl"
            />
          </div>

          <Button type="submit" disabled={loading} className="rounded-xl">
            <Sparkle className="mr-1.5 size-4" />
            {loading ? "Building plan…" : "Generate plan"}
          </Button>
        </form>

        <div className="flex flex-col gap-6">
          {loading && <PlanSkeleton />}

          {!loading && !plan && (
            <section className="panel grid min-h-[24rem] place-items-center p-8 text-center">
              <div className="max-w-sm">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
                  <Target className="size-5" />
                </span>
                <h2 className="mt-3 text-sm font-medium">No plan yet</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Describe a goal on the left. Lumen returns a daily schedule, weekly focus areas,
                  milestones and a priority breakdown.
                </p>
              </div>
            </section>
          )}

          {!loading && plan && <PlanResult plan={plan} />}
        </div>
      </div>
    </div>
  );
}

function PlanSkeleton() {
  return (
    <section className="panel space-y-4 p-5 sm:p-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-40 w-full" />
    </section>
  );
}

function PlanResult({ plan }: { plan: GeneratedPlan }) {
  return (
    <>
      <section className="panel p-5 sm:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">Plan summary</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 rounded-full">
            <Clock className="mr-1 size-3.5" />
            {plan.totalEstimatedHours}h
          </Badge>
        </div>

        {plan.priorityBreakdown?.length > 0 && (
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {plan.priorityBreakdown.map((item) => (
              <div key={item.label} className="surface-soft p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate text-xs text-muted-foreground">{item.label}</p>
                  <span className="shrink-0 text-sm font-semibold">{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel overflow-hidden">
        <Tabs defaultValue="daily">
          <div className="border-b border-border px-5 pt-4">
            <TabsList className="rounded-xl">
              <TabsTrigger value="daily" className="rounded-lg">
                Daily schedule
              </TabsTrigger>
              <TabsTrigger value="weekly" className="rounded-lg">
                Weekly plan
              </TabsTrigger>
              <TabsTrigger value="milestones" className="rounded-lg">
                Milestones
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily" className="m-0 space-y-5 p-5 sm:p-6">
            {plan.dailySchedule.map((day) => (
              <article key={day.day}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <h3 className="min-w-0 truncate text-sm font-semibold">{day.day}</h3>
                  <span className="shrink-0 truncate text-xs text-muted-foreground">
                    {day.focus}
                  </span>
                </div>
                <ol className="mt-3 space-y-2">
                  {day.blocks.map((block, i) => (
                    <li
                      key={`${day.day}-${i}`}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-border p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <span className="shrink-0 rounded-lg bg-muted px-2 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                        {block.time}
                      </span>
                      <p className="col-span-2 min-w-0 text-sm sm:col-span-1">{block.task}</p>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-muted-foreground">{block.minutes}m</span>
                        <PriorityDot priority={block.priority} />
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="weekly" className="m-0 grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            {plan.weeklyPlan.map((week) => (
              <article key={week.week} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="size-4 shrink-0 text-primary" />
                  <h3 className="min-w-0 truncate text-sm font-semibold">{week.week}</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{week.focus}</p>
                <ul className="mt-3 space-y-1.5">
                  {week.goals.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ListChecks className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      <span className="min-w-0">{g}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="milestones" className="m-0 p-5 sm:p-6">
            <ol className="relative space-y-6 border-l border-border pl-6">
              {plan.milestones.map((m, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] grid size-5 place-items-center rounded-full border border-border bg-background">
                    <Flag className="size-2.5 text-primary" />
                  </span>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <h3 className="min-w-0 truncate text-sm font-semibold">{m.title}</h3>
                    <span className="shrink-0 text-xs text-muted-foreground">{m.due}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                </li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>
      </section>

      {plan.recommendations?.length > 0 && (
        <section className="panel p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Lightbulb className="size-4 text-primary" />
            Recommendations
          </h2>
          <ul className="mt-3 space-y-2">
            {plan.recommendations.map((r, i) => (
              <li key={i} className="surface-soft p-3 text-sm leading-relaxed">
                {r}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <AiDisclaimer />
          </div>
        </section>
      )}
    </>
  );
}

function PriorityDot({ priority }: { priority: "high" | "medium" | "low" }) {
  const tone = {
    high: "bg-primary",
    medium: "bg-chart-3",
    low: "bg-muted-foreground/50",
  }[priority];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full", tone)} aria-hidden />
      <span className="sr-only">{priority} priority</span>
    </span>
  );
}
