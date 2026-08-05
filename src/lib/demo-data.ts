export const notifications = [
  { id: "n1", title: "Weekly productivity report is ready", time: "12 minutes ago", read: false },
  { id: "n2", title: "Plan “Q3 launch runway” hit milestone 2", time: "1 hour ago", read: false },
  { id: "n3", title: "Draft email to Priya was saved", time: "Yesterday", read: true },
];

export const stats = [
  { label: "Emails Generated", value: "248", delta: "+18%", trend: "up", hint: "vs last month" },
  { label: "Tasks Planned", value: "1,032", delta: "+9%", trend: "up", hint: "vs last month" },
  { label: "AI Conversations", value: "96", delta: "+24%", trend: "up", hint: "vs last month" },
  { label: "Productivity Score", value: "87", delta: "+4 pts", trend: "up", hint: "this week" },
] as const;

export const usageSeries = [
  { day: "Mon", emails: 12, tasks: 34, chats: 5 },
  { day: "Tue", emails: 18, tasks: 41, chats: 8 },
  { day: "Wed", emails: 9, tasks: 28, chats: 4 },
  { day: "Thu", emails: 22, tasks: 52, chats: 11 },
  { day: "Fri", emails: 16, tasks: 46, chats: 9 },
  { day: "Sat", emails: 4, tasks: 12, chats: 2 },
  { day: "Sun", emails: 6, tasks: 18, chats: 3 },
];

export const recentActivity = [
  { id: "a1", type: "email", title: "Follow-up: pricing proposal for Northwind", time: "8m ago" },
  { id: "a2", type: "plan", title: "Plan created — “Ship onboarding revamp”", time: "42m ago" },
  { id: "a3", type: "chat", title: "Asked about summarising the board deck", time: "2h ago" },
  { id: "a4", type: "email", title: "Shortened intro email to design candidate", time: "5h ago" },
  { id: "a5", type: "plan", title: "Milestone completed — “Research interviews”", time: "Yesterday" },
];

export const todaysTasks = [
  { id: "t1", title: "Review Q3 marketing brief", done: true, priority: "high" },
  { id: "t2", title: "Send follow-up to Northwind", done: false, priority: "high" },
  { id: "t3", title: "Draft onboarding checklist", done: false, priority: "medium" },
  { id: "t4", title: "Plan sprint retro agenda", done: false, priority: "low" },
] as const;

export const suggestions = [
  {
    id: "s1",
    title: "Follow up on 3 stale threads",
    body: "Three emails from last week have no reply. Generate polite nudges in one pass.",
    to: "/email" as const,
    cta: "Draft nudges",
  },
  {
    id: "s2",
    title: "Your Thursdays are overloaded",
    body: "52 planned task-minutes above your average. Rebalance into Friday morning.",
    to: "/planner" as const,
    cta: "Rebalance week",
  },
  {
    id: "s3",
    title: "Summarise the board deck",
    body: "You opened this file three times without notes. Ask Lumen for a 5-bullet summary.",
    to: "/assistant" as const,
    cta: "Ask Lumen",
  },
];

export const recentEmails = [
  { id: "e1", subject: "Pricing proposal — next steps", to: "priya@northwind.co", tone: "Persuasive", time: "8m ago" },
  { id: "e2", subject: "Welcome aboard, Sam!", to: "sam.reed@acme.io", tone: "Warm", time: "3h ago" },
  { id: "e3", subject: "Rescheduling Thursday's review", to: "team@lumen.ai", tone: "Concise", time: "Yesterday" },
];

export const deadlines = [
  { id: "d1", title: "Board deck final draft", due: "Tomorrow, 09:00", progress: 78 },
  { id: "d2", title: "Onboarding revamp — phase 1", due: "Fri, 17:00", progress: 45 },
  { id: "d3", title: "Q3 hiring plan sign-off", due: "Next Mon", progress: 20 },
];

export const insights = [
  { label: "Deep-focus hours", value: "18.5h", change: "+2.4h" },
  { label: "Avg. email draft time", value: "44s", change: "-31s" },
  { label: "Tasks completed on time", value: "92%", change: "+6%" },
];

export const historyEntries = [
  { id: "h1", tool: "Email Generator", title: "Follow-up: pricing proposal for Northwind", time: "Today, 14:02" },
  { id: "h2", tool: "Task Planner", title: "Ship onboarding revamp in 3 weeks", time: "Today, 13:28" },
  { id: "h3", tool: "AI Assistant", title: "Summarise the board deck", time: "Today, 11:50" },
  { id: "h4", tool: "Email Generator", title: "Intro email to design candidate", time: "Yesterday, 16:14" },
  { id: "h5", tool: "Task Planner", title: "Q3 hiring plan", time: "Mon, 09:41" },
];
