import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Circle,
  Lightbulb,
  ListChecks,
  Mail,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip as ReTooltip, XAxis } from "recharts";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deadlines,
  insights,
  recentActivity,
  recentEmails,
  stats,
  suggestions,
  todaysTasks,
  usageSeries,
} from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Lumen AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Track emails generated, tasks planned, AI conversations and your productivity score in one calm dashboard.",
      },
      { property: "og:title", content: "Dashboard — Lumen AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Your AI productivity command centre: stats, activity, quick actions and suggestions.",
      },
    ],
  }),
  component: Dashboard,
});

const statIcons = [Mail, ListChecks, MessageSquare, TrendingUp];

const activityIcon = { email: Mail, plan: ListChecks, chat: MessageSquare } as const;

function Dashboard() {
  const [tasks, setTasks] = useState(() => todaysTasks.map((t) => ({ ...t })));
  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8">
      <PageHeader
        eyebrow="Good afternoon, Alex"
        title="Your productivity at a glance"
        description="Lumen has been busy. Here's what moved today and what deserves your attention next."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/planner">Plan my day</Link>
            </Button>
            <Button asChild className="rounded-xl">
              <Link to="/email">
                New email <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </>
        }
      />

      <section aria-label="Usage statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = statIcons[i] ?? Mail;
          return (
            <article
              key={stat.label}
              className="panel animate-fade-up p-5 transition-shadow hover:shadow-lift"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <p className="min-w-0 truncate text-sm text-muted-foreground">{stat.label}</p>
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-0.5 font-medium text-success">
                  <ArrowUpRight className="size-3.5" />
                  {stat.delta}
                </span>
                {stat.hint}
              </p>
            </article>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="panel xl:col-span-2 p-5 sm:p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold">Usage statistics</h2>
              <p className="text-sm text-muted-foreground">Last 7 days across all AI tools</p>
            </div>
            <Badge variant="secondary" className="shrink-0 rounded-full">
              This week
            </Badge>
          </div>
          <div className="mt-5 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageSeries} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ReTooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-popover)",
                    color: "var(--color-popover-foreground)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#fillTasks)"
                />
                <Area
                  type="monotone"
                  dataKey="emails"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  fill="url(#fillEmails)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {insights.map((item) => (
              <div key={item.label} className="surface-soft p-4">
                <dt className="truncate text-xs text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-semibold">{item.value}</span>
                  <span className="text-xs font-medium text-success">{item.change}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="panel p-5 sm:p-6">
          <h2 className="text-base font-semibold">Quick actions</h2>
          <p className="text-sm text-muted-foreground">Jump straight into a tool</p>
          <div className="mt-4 grid gap-2">
            {[
              { to: "/email" as const, icon: Mail, label: "Generate an email", hint: "5 tones" },
              { to: "/planner" as const, icon: ListChecks, label: "Plan a goal", hint: "AI timeline" },
              { to: "/assistant" as const, icon: MessageSquare, label: "Ask Lumen", hint: "Chat" },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                  <action.icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{action.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{action.hint}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <h3 className="truncate text-sm font-semibold">Today's tasks</h3>
              <span className="shrink-0 text-xs text-muted-foreground">
                {completed}/{tasks.length} done
              </span>
            </div>
            <Progress value={(completed / tasks.length) * 100} className="mt-2 h-1.5" />
            <ul className="mt-3 space-y-1">
              {tasks.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setTasks((prev) =>
                        prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
                      )
                    }
                    aria-pressed={task.done}
                    className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent/60"
                  >
                    {task.done ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-sm",
                        task.done && "text-muted-foreground line-through",
                      )}
                    >
                      {task.title}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="panel xl:col-span-2 overflow-hidden">
          <Tabs defaultValue="activity">
            <div className="border-b border-border px-5 pt-4">
              <TabsList className="rounded-xl">
                <TabsTrigger value="activity" className="rounded-lg">
                  Recent activity
                </TabsTrigger>
                <TabsTrigger value="emails" className="rounded-lg">
                  Recent emails
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="activity" className="m-0 p-2 sm:p-3">
              <ul className="divide-y divide-border">
                {recentActivity.map((item) => {
                  const Icon = activityIcon[item.type as keyof typeof activityIcon] ?? Mail;
                  return (
                    <li
                      key={item.id}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-2 py-3"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <p className="min-w-0 truncate text-sm">{item.title}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                    </li>
                  );
                })}
              </ul>
            </TabsContent>
            <TabsContent value="emails" className="m-0 p-2 sm:p-3">
              <ul className="divide-y divide-border">
                {recentEmails.map((mail) => (
                  <li key={mail.id} className="px-2 py-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <p className="min-w-0 truncate text-sm font-medium">{mail.subject}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{mail.time}</span>
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">To {mail.to}</span>
                      <Badge variant="outline" className="rounded-full text-[11px]">
                        {mail.tone}
                      </Badge>
                    </p>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </section>

        <section className="panel p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Lightbulb className="size-4 text-primary" />
            AI suggestions
          </h2>
          <div className="mt-4 space-y-3">
            {suggestions.map((s) => (
              <article key={s.id} className="surface-soft p-4">
                <h3 className="text-sm font-medium">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
                <Button asChild variant="ghost" size="sm" className="mt-2 -ml-2 rounded-lg text-primary">
                  <Link to={s.to}>
                    {s.cta} <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="panel p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <CalendarClock className="size-4 text-primary" />
          Upcoming deadlines
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {deadlines.map((item) => (
            <article key={item.id} className="rounded-xl border border-border p-4">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.due}</p>
              <Progress value={item.progress} className="mt-3 h-1.5" />
              <p className="mt-2 text-xs text-muted-foreground">{item.progress}% complete</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    high: "bg-primary-soft text-primary-soft-foreground",
    medium: "bg-muted text-muted-foreground",
    low: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        styles[priority] ?? styles["low"],
      )}
    >
      {priority}
    </span>
  );
}
