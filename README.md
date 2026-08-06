# Lumen — AI Productivity Assistant

A premium, modern AI productivity assistant built with TanStack Start, React, TypeScript, and Tailwind CSS. Lumen helps you draft emails, plan tasks, and have threaded AI conversations — all in a clean, white-space-driven interface with a subtle muted-pink accent.

![Lumen Preview](https://pivot-assist-hub.lovable.app/preview.png)

## Features

- **Dashboard** — Overview of recent activity, quick actions, and usage insights.
- **AI Email Generator** — Generate, improve, rewrite, shorten, or expand professional emails from a few inputs.
- **Task Planner** — Turn a goal into a structured, time-boxed plan with daily schedules, milestones, and weekly focus.
- **AI Assistant** — Multi-thread chat interface with streaming responses, persisted locally in the browser.
- **Dark Mode** — Fully theme-aware with system preference detection and manual toggle.
- **Responsive Sidebar** — Collapsible workspace navigation with mobile support.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — Full-stack React framework with server functions.
- [React 19](https://react.dev) — UI library.
- [TypeScript](https://www.typescriptlang.org) — Type-safe development.
- [Tailwind CSS v4](https://tailwindcss.com) — Utility-first styling with CSS theme variables.
- [shadcn/ui](https://ui.shadcn.com) — Accessible component primitives.
- [AI SDK](https://sdk.vercel.ai) — Streaming LLM integration via Lovable AI Gateway.
- [Zod](https://zod.dev) — Schema validation for server functions.

## Getting Started

### Prerequisites

- Node.js 20+ (recommended via [nvm](https://github.com/nvm-sh/nvm))
- [bun](https://bun.sh) or npm
- A Lovable project with the Lovable AI Gateway enabled

### Installation

```bash
git clone <repository-url>
cd lumen
cp .env.example .env.local
bun install
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
LOVABLE_API_KEY=your-lovable-api-key
```

The `LOVABLE_API_KEY` is required for server-side AI calls through the Lovable AI Gateway.

### Development

```bash
bun run dev
```

The app will be available at `http://localhost:8080`.

### Build

```bash
bun run build
```

## Project Structure

```text
src/
├── components/
│   ├── ai-elements/        # Reusable chat UI primitives
│   ├── assistant/          # Assistant chat window
│   ├── layout/             # Sidebar, top bar, navigation
│   └── shared/             # Output panel, page header, AI disclaimer
├── lib/
│   ├── ai-gateway.server.ts # Lovable AI Gateway provider setup
│   ├── ai.functions.ts      # Server functions for email & planner
│   ├── demo-data.ts         # Dashboard mock data
│   ├── threads.ts           # LocalStorage thread management
│   └── theme.tsx            # Theme provider & dark mode logic
├── routes/
│   ├── __root.tsx           # Root layout
│   ├── index.tsx            # Dashboard
│   ├── email.tsx            # Email generator
│   ├── planner.tsx          # Task planner
│   ├── assistant.index.tsx  # Assistant thread list
│   └── assistant.$threadId.tsx # Active assistant thread
├── start.ts                 # TanStack Start configuration
└── styles.css               # Global design tokens & Tailwind theme
```

## AI Features

### Email Generator

Located at `/email`. Enter a purpose, recipient, tone, and optional context to generate a complete email. Actions include:

- Generate
- Improve
- Rewrite
- Shorten
- Expand

### Task Planner

Located at `/planner`. Input a goal, deadline, priority, and available hours per day to receive:

- Summary & total estimated hours
- Daily schedule with time blocks
- Weekly plan with focus areas
- Milestones with due dates
- Priority breakdown (percentages summing to 100)
- Actionable recommendations

### AI Assistant

Located at `/assistant`. Create multiple threads, rename or delete them, and chat with a streaming AI model. Conversations are stored in the browser's `localStorage`.

## Design System

- **Primary accent:** Muted pink (`oklch(0.68 0.108 8.5)`)
- **Background:** Pure white in light mode, near-black in dark mode
- **Typography:** Clean sans-serif stack with tight tracking on headings
- **Shadows:** Soft, lifted, and pink-tinted shadow tokens
- **Animation:** Subtle fade-up and fade-in transitions

## Deployment

This project is optimized for Lovable Cloud / Edge deployment. Publish directly from the Lovable editor, or connect to GitHub for two-way sync and custom CI/CD.

## License

MIT — built with Lovable.
